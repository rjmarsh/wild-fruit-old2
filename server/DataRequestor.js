const SkmsWebApiClient = require('./SkmsWebApiClient.js');
const fs = require('fs');
const crypto = require('crypto');
const moment = require('moment');

/**
 * Gets the data required for populating the UI
 */
class DataRequestor {
	/**
	 * Constructor
	 * @param {string} username The username for connecting to the SKMS Web API
	 * @param {string} passkey The passkey associated with the username
	 * @param {string} domain The SKMS domain to connect to
	 */
	constructor(username, passkey, domain) {
		this.HISTORY_DAYS = 40;
		this.NUM_HOURS_ISSUE_IS_RECENT = 4;

		this.FUTURE_DAYS = 2;

		this.CMR_STATE_CANCELED = 6;

		this.MW_STATE_ANNOUNCED = 3;
		this.MW_STATE_COMPLETED = 4;
		this.MW_STATE_CANCELED  = 5;

		this.username = username;
		this.passkey = passkey;
		this.domain = domain;
	}

	/**
	 * Get the services
	 * @param {function} callback The callback function to call if successful that will be passed the service data
	 */
	getServices(callback) {
		if(this.services && this.services.generation_timestamp > moment().subtract(1, 'minute').unix()) {
			// Use cached version
			callback(null, this.services);
			return;
		}
		/**
		 * Formats the service directory name so it will display correctly in a URL
		 * @param {string} service_name The name of the service
		 * @returns {string} The url friendly name
		 */
		function get_service_directory_name(service_name) {
			let service_directory_name = service_name.trim().toLocaleLowerCase();

			// Replace ampersands with the word "and"
			service_directory_name = service_directory_name.replace(/&/gi, 'and');

			// Remove any characters which are not alphanumeric, a hyphen or space
			service_directory_name = service_directory_name.replace(/[^0-9a-z\-\s]/gi, '');

			// Replace spaces with underscores
			service_directory_name = service_directory_name.replace(/\s+/g, '_');

			return service_directory_name;
		}

		const skms_web_api_client = new SkmsWebApiClient(this.username, this.passkey, this.domain);

		// Get the list of all clouds, solutions, capabilities and business services
		const query = 'SELECT service_id, name, marketing_name, service_type.name, service_type_id, customer_facing, direct_depends_on_service.service_id, direct_depends_on_service.name, direct_depends_on_service.service_type.name, direct_depends_on_business_service.environment.environment_id, direct_depends_on_business_service.environment.marketing_name, direct_depends_on_business_service.environment.name, direct_depends_on_business_service.environment.environment_type_id, xsst_show_environments, xsst_list_environments, url.url_id, url.url, url.primary WHERE active=1 AND (customer_facing=1 OR service_type_id=1) AND service_type_id <= 4 ORDER BY service_id ASC PAGE 1,5000';

		// Get an array of service icons
		const icon_promise = new Promise((resolve) => {
			fs.readdir(__dirname + '/../static/img/service_icons/', (err, files) => {
				if(err) {
					resolve([]);
				} else {
					resolve(files);
				}
			});
		});

		const skms_request_promise = new Promise((resolve) => {
			skms_web_api_client.sendRequest('ServiceDao', 'search', {query: query}, resolve);
		});

		const cloud_id_arr = [0];
		const solution_id_arr = [];
		const capability_id_arr = [];
		const business_service_id_arr = [];

		Promise.all([icon_promise, skms_request_promise]).then((promise_values) => {
			const service_icons = promise_values[0];
			if(skms_web_api_client.getResponseStatus() === 'success') {
				const service_data_arr = skms_web_api_client.getDataArray().results;
				const service_name_arr = {0: 'Additional Services'};

				/**
				 * Sorts service ids by a name using the mapping in service_name_arr
				 * @param {Number} service_id1 A service id to compare to service_id2
				 * @param {Number} service_id2 A service id to compare to service_id1
				 * @returns {Number} -1 if service id 1 is less than 2, 1 if 1 is greater than 2, 0 if they're equal
				 */
				const service_name_sort = function(service_id1, service_id2) {
					const s1_lower = service_name_arr[service_id1].toLocaleLowerCase();
					const s2_lower = service_name_arr[service_id2].toLocaleLowerCase();
					if(s1_lower == s2_lower) {
						return 0;
					}
					return (s1_lower > s2_lower) ? 1 : -1;
				};

				const service_arr = {
					'0': {
						'localize_key': 'additional_services',
						'service_id': 0,
						'service_name': 'Additional Services',
						'type': 'cloud',
						'url': '/' + get_service_directory_name('Additional Services'),
						'has_icon': service_icons.indexOf('0.png') != -1,
					}
				};

				if(!this.service_directory) {
					this.service_directory = {};
				}

				this.service_directory[get_service_directory_name('Additional Services')] = 0;

				const cache_service_data_arr = {};

				service_data_arr.forEach((service_data) => {
					const service_id = service_data.service_id;
					const service_name = (service_data.marketing_name.trim() ? service_data.marketing_name.trim() : service_data.name.trim());
					const service_type = service_data['service_type.name'].trim().toLocaleLowerCase();


					cache_service_data_arr[service_id] = service_data;

					service_name_arr[service_id] = service_name;

					// Only show clouds that are customer facing or have a primary external url
					if(service_type == 'cloud' && service_data.customer_facing == '0') {
						const primary_external_url_arr = service_data.url.filter((url_obj) => {
							return url_obj.primary == '1' && !url_obj.url.match('/status.adobe.com/i');
						});

						if(primary_external_url_arr.length > 0) {
							return;
						}
					}

					// Add this service to the service array
					service_arr[service_id] = {
						service_id: parseInt(service_id),
						service_name: service_name,
						type: service_type,
						direct_depends_on_service_ids: service_data['direct_depends_on_service.service_id']
					};

					switch(service_type) {
						case 'cloud':
							cloud_id_arr.push(parseInt(service_id));
							service_arr[service_id].has_icon = (service_icons.indexOf(service_id + '.png') != -1);
							break;
						case 'solution':
							solution_id_arr.push(parseInt(service_id));
							service_arr[service_id].has_icon = (service_icons.indexOf(service_id + '.png') != -1);
							break;
						case 'capability':
							capability_id_arr.push(parseInt(service_id));
							service_arr[service_id].has_icon = (service_icons.indexOf(service_id + '.png') != -1);

							service_arr[service_id].show_environments = (service_data.xsst_show_environments == '1');

							// Record business service environments
							if(service_data['xsst_list_environments'] == '1') {
								const seen_environment_ids = [];
								service_arr[service_id].business_service_environments = [];

								service_data.direct_depends_on_business_service.forEach((bs) => {
									bs.environment.forEach((bs_environment) => {
										if(bs_environment.environment_type_id == '1' && !seen_environment_ids.includes(bs_environment['environment_id'])) {
											seen_environment_ids.push(bs_environment['environment_id']);
											service_arr[service_id].business_service_environments.push({
												'environment_id': bs_environment['environment_id'],
												'name': (bs_environment['marketing_name'] ? bs_environment['marketing_name'] : bs_environment['name'])
											});
										}
									});
								});

								// Sort business service environments by name
								service_arr[service_id].business_service_environments.sort(($a, $b) => {
									if($a['name'] == $b['name']) {
										return 0;
									}
									return ($a['name'] > $b['name']) ? 1 : -1;
								});
							}
							break;
						case 'business service':
							business_service_id_arr.push({service_id: parseInt(service_id), name: service_name});
							service_arr[service_id].show_environments = false;
							break;
					}

					if(parseInt(service_data.customer_facing) == 1 && service_data.url && service_data.url.length > 0) {
						let set_url_id;

						service_data.url.forEach((url_arr) => {
							const url_id = url_arr.url_id;
							const url = url_arr.url;
							const url_is_primary = parseInt(url_arr.primary) == 1;

							const matches = url.match(/^(http[s]?:\/\/)?status\.adobe\.com\/([A-Za-z0-9_]+)/i);
							let service_directory_name = "";
							if(matches && matches.length > 2) {
								service_directory_name = matches[2];
								this.service_directory[service_directory_name] = parseInt(service_id);
							}

							if(url_is_primary && (set_url_id === undefined || url_id > set_url_id)) {
								if(service_directory_name != "") {
									service_arr[service_id].url = '/' + service_directory_name;
								} else {
									service_arr[service_id].url = url;
								}
								set_url_id = url_id;
							}
						});
					}
				});

				// Arrays to store which solutions/capabilities are associated with a cloud - to know which need to be added to the "Additional Solutions" cloud
				const solution_ids_linked_to_cloud = [];
				const capability_ids_lined_to_cloud = [];

				// Track the business services linked to capabilities so that we can remove any unused business services later
				const business_service_ids_linked_to_capability = [];

				// Loop through and add the dependency elements based on the direct depends on service ids
				Object.keys(service_arr).forEach((service_id) => {
					if(service_arr[service_id].direct_depends_on_service_ids && service_arr[service_id].direct_depends_on_service_ids.length > 0) {
						service_arr[service_id].direct_depends_on_service_ids.forEach((direct_depends_on_service_id) => {
							if(service_arr[direct_depends_on_service_id]) {
								switch (service_arr[direct_depends_on_service_id].type) {
									case 'solution':
										solution_ids_linked_to_cloud.push(parseInt(direct_depends_on_service_id));

										if(!service_arr[service_id].solutions) {
											service_arr[service_id].solutions = [];
										}
										service_arr[service_id].solutions.push(parseInt(direct_depends_on_service_id));

										// Link solutions to parent clouds
										if (service_arr[service_id]['type'] == 'cloud') {
											if (!service_arr[direct_depends_on_service_id].parents) {
												service_arr[direct_depends_on_service_id].parents = [];
											}
											if (service_arr[direct_depends_on_service_id].parents.indexOf(service_id) === -1) {
												service_arr[direct_depends_on_service_id].parents.push(parseInt(service_id));
											}
										}
										break;
									case 'capability':
										capability_ids_lined_to_cloud.push(parseInt(direct_depends_on_service_id));

										if(!service_arr[service_id]['capabilities']) {
											service_arr[service_id]['capabilities'] = [];
										}
										service_arr[service_id]['capabilities'].push(parseInt(direct_depends_on_service_id));

										// Link capability to parent clouds
										if (service_arr[service_id]['type'] == 'solution') {
											if (!service_arr[direct_depends_on_service_id].parents) {
												service_arr[direct_depends_on_service_id].parents = [];
											}
											if (service_arr[direct_depends_on_service_id].parents.indexOf(service_id) === -1) {
												service_arr[direct_depends_on_service_id].parents.push(parseInt(service_id));
											}
										}
										break;
									case 'business service':
										if (service_arr[service_id]['type'] == 'capability') {
											business_service_ids_linked_to_capability.push(parseInt(direct_depends_on_service_id));
											if (!service_arr[service_id].all_business_services) {
												service_arr[service_id].all_business_services = [];
											}
											service_arr[service_id].all_business_services.push(parseInt(direct_depends_on_service_id));

											// Add the capability to the business service
											if(!service_arr[direct_depends_on_service_id].capabilities) {
												service_arr[direct_depends_on_service_id].capabilities = [];
											}
											if(service_arr[direct_depends_on_service_id].capabilities.indexOf(service_id) === -1) {
												service_arr[direct_depends_on_service_id].capabilities.push(parseInt(service_id));
											}

											// Link the business service to parent capabilities
											if(!service_arr[direct_depends_on_service_id].parents) {
												service_arr[direct_depends_on_service_id].parents = [];
											}
											if(service_arr[direct_depends_on_service_id].parents.indexOf(service_id) === -1) {
												service_arr[direct_depends_on_service_id].parents.push(parseInt(service_id));
											}

											// Set the show_environments flag to true on the business service if the capability show_environments flag is set to true
											if(service_arr[service_id].show_environments === true) {
												service_arr[direct_depends_on_service_id].show_environments = true;
											}
										}
										break;
								}
							}
						});
					}

					if(service_arr[service_id].solutions) {
						service_arr[service_id].solutions = service_arr[service_id].solutions.sort(service_name_sort);
					}

					if(service_arr[service_id].capabilities) {
						service_arr[service_id].capabilities = service_arr[service_id].capabilities.sort(service_name_sort);
					}

					delete service_arr[service_id].direct_depends_on_service_ids;
				});

				// Add unallocated solutions to the "Additional Services" cloud
				service_arr['0'].solutions = solution_id_arr.sort(service_name_sort).filter((solution_id) => {
					return solution_ids_linked_to_cloud.indexOf(solution_id) === -1;
				});

				service_arr['0'].solutions.forEach((solution_id) => {
					if(!service_arr[solution_id].parents) {
						service_arr[solution_id].parents = [];
					}
					service_arr[solution_id].parents.push(0);
				});

				// Add unallocated capabilities to the "Additional Services" cloud
				service_arr['0'].capabilities = capability_id_arr.sort(service_name_sort).filter((capability_id) => {
					return capability_ids_lined_to_cloud.indexOf(capability_id) === -1;
				});

				service_arr['0'].capabilities.forEach((capability_id) => {
					if(!service_arr[capability_id].parents) {
						service_arr[capability_id].parents = [];
					}
					service_arr[capability_id].parents.push(0);
				});

				// Remove any business services which are not linked to any capability
				const unused_business_service_id_arr = business_service_id_arr.filter((business_service) => {
					return business_service_ids_linked_to_capability.indexOf(parseInt(business_service.service_id)) === -1;
				}).map((service) => {
					return service.service_id;
				});

				unused_business_service_id_arr.forEach((service_id) => {
					delete service_arr[service_id];
				});

				// Build the "all business services" array for solutions
				solution_id_arr.forEach((solution_id) => {
					if(service_arr[solution_id].capabilities) {
						service_arr[solution_id].capabilities.forEach((capability_service_id) => {
							if(service_arr[capability_service_id].all_business_services && service_arr[capability_service_id].all_business_services.length > 0) {
								if(!service_arr[solution_id].all_business_services) {
									service_arr[solution_id].all_business_services = [];
								}
								service_arr[solution_id].all_business_services = service_arr[capability_service_id].all_business_services.concat(service_arr[solution_id].all_business_services);
							}
						});
					}
				});

				// Build the "all business services" array for clouds
				cloud_id_arr.forEach((cloud_id) => {
					// Loop through solutions linked to the cloud
					if (service_arr[cloud_id].solutions && service_arr[cloud_id].solutions.length > 0) {
						service_arr[cloud_id].solutions.forEach((solution_service_id) => {
							if (service_arr[solution_service_id].all_business_services && service_arr[solution_service_id].all_business_services.length > 0) {
								if (!service_arr[cloud_id].all_business_services) {
									service_arr[cloud_id].all_business_services = [];
								}
								service_arr[cloud_id].all_business_services = service_arr[cloud_id].all_business_services.concat(service_arr[solution_service_id].all_business_services);
							}
						});
					}

					// Loop through capabilities linked to the cloud
					if(service_arr[cloud_id].capabilities && service_arr[cloud_id].capabilities.length > 0) {
						service_arr[cloud_id].capabilities.forEach((capability_service_id) => {
							if(service_arr[capability_service_id].all_business_services && service_arr[capability_service_id].all_business_services.length > 0) {
								if(!service_arr[cloud_id].all_business_services) {
									service_arr[cloud_id].all_business_services = [];
								}
								service_arr[cloud_id].all_business_services = service_arr[cloud_id].all_business_services.concat(service_arr[capability_service_id].all_business_services);
							}
						});
					}
				});

				/**
				 * Only use the internal link to cloud dependencies if there are dependencies. If there are not dependencies, then use the first external URL link that isn't internal
				 */
				cloud_id_arr.forEach((service_id) => {
					if(service_id < 1) {
						return;
					}

					const service_details = service_arr[service_id];

					const cloud_has_capabilities = (service_details.capabilities && service_details.capabilities.length > 0);
					const cloud_has_solutions = (service_details.solutions && service_details.solutions.length > 0);
					const cloud_has_business_services = (service_details.all_business_services && service_details.all_business_services.length > 0);

					if(cloud_has_capabilities || cloud_has_solutions || cloud_has_business_services) {
						return;
					}

					const service_data = cache_service_data_arr[service_id];

					service_data.url.forEach((url_arr) => {
						const url = url_arr.url;

						const matches = url.match(/^(http[s]?:\/\/)?status\.adobe\.com(\/|$)/i);
						if(!matches) {
							service_arr[service_id].url = url;
						}
					});
				});

				const service_json_arr = {
					"services": service_arr,
					"clouds": cloud_id_arr
				};
				service_json_arr.md5 = crypto.createHash('md5').update(JSON.stringify(service_json_arr)).digest('hex');
				service_json_arr.generation_timestamp = moment().unix();

				this.services = service_json_arr;
				callback(null, service_json_arr);
			} else {
				callback(skms_web_api_client.getErrorMessage());
			}

		}).catch((reason) => {
			callback(reason);
		});
	}

	/**
	 * Gets service directory data
	 * @param {function} callback The callback function to call with error and service directory data
	 */
	getServiceDirectory(callback) {
		this.getServices((err) => {
			callback(err, this.service_directory);
		});
	}

	/**
	 * Get the incidents
	 * @param {function} callback The callback function to call if that will be passed the error or incident data
	 */
	getIncidents(callback) {
		if(this.incidents && this.incidents.generation_timestamp > moment().subtract(1, 'minute').unix()) {
			// Use cached version
			callback(null, this.incidents);
			return;
		}

		// Setup an array of valid service IDs to display environments for
		const environment_display_service_id_arr = [];

		this.getServices((err, service_arr) => {
			if(err) {
				callback(err);
				return;
			}

			if(service_arr.services) {
				Object.keys(service_arr.services).forEach((service_id) => {
					if(service_arr.services[service_id].show_environments) {
						environment_display_service_id_arr.push(parseInt(service_id));
					}
				});
			}

			// Check for an active global status message (need 2 clients to do 2 simultaneous calls)
			const global_message_api_client = new SkmsWebApiClient(this.username, this.passkey, this.domain);
			const incident_data_api_client = new SkmsWebApiClient(this.username, this.passkey, this.domain);

			// Get the max history timestamp
			const history_max_timestamp = moment().subtract(this.HISTORY_DAYS, 'days').unix();

			const global_message_promise = new Promise((resolve) => {
				global_message_api_client.sendRequest('IncidentDao', 'getStatusMessage', {}, resolve);
			});

			// Get the list of incidents
			const query = `SELECT incident_id, incident_number, DATE_FORMAT("U", started_on) AS started_on, DATE_FORMAT("U", repaired_on) AS repaired_on, DATE_FORMAT("U", resolved_on) AS resolved_on,
			severity, incident_to_service.service_id, incident_to_service.service_type.name, incident_to_service.problem, incident_to_service.problem_label.value, incident_to_service.service.customer_facing,
			DATE_FORMAT("U", external_communication.created_on) AS external_communication.created_on, external_communication.message, external_communication.external_communication_template_id,
			external_communication.external_communication_template.default_message,
			incident_to_service.service.active, incident_to_service.environment_id, incident_to_service.environment.name, incident_to_service.environment.environment_type_id
			WHERE severity < 3 AND (started_on >= DATE(${history_max_timestamp}) OR resolved_on >= DATE(${history_max_timestamp}) OR resolved_on = 0)
			ORDER BY incident_number DESC, incident_to_service.service_id ASC PAGE 1,5000`;

			const incident_data_promise = new Promise((resolve) => {
				incident_data_api_client.sendRequest('IncidentDao', 'search', {query: query}, resolve);
			});

			Promise.all([global_message_promise, incident_data_promise]).then(() => {
				const incident_arr = [];

				if(global_message_api_client.getResponseStatus() === 'success' && incident_data_api_client.getResponseStatus() === 'success') {
					const incident_data_arr = incident_data_api_client.getDataArray().results;

					// Loop through the incident data and build the incident JSON Array
					incident_data_arr.forEach((incident_data) => {
						const affected_services_arr = [];
						const problem_arr = {};
						if (incident_data.incident_to_service && incident_data.incident_to_service.length > 0) {
							incident_data.incident_to_service.forEach((incident_service) => {
								const service_id = parseInt(incident_service.service_id);
								// Only look at this record if it is an active customer facing business service
								if (incident_service.service.active && incident_service.service.customer_facing && incident_service.service_type.name && incident_service.service_type.name.toLocaleLowerCase() == 'business service') {
									// Skip if this is not a production environment being affected
									if (incident_service.environment_id != '0' && incident_service.environment.environment_type_id != '1') {
										return;
									}

									// Create the affected services array item if necessary
									if (affected_services_arr.indexOf(service_id) === -1) {
										affected_services_arr.push(service_id);
									}


									// Create or add the problem type
									const problem_name = ((incident_service.problem_label && incident_service.problem_label.value) ? incident_service.problem_label.value.toLocaleLowerCase() : '');
									if (!problem_arr[problem_name]) {
										problem_arr[problem_name] = {};
									}
									if (!problem_arr[problem_name][service_id]) {
										problem_arr[problem_name][service_id] = {'service_id': service_id};
									}

									// Create or add the environment(s)
									if (incident_service.environment_id && incident_service.environment_id > 0 && environment_display_service_id_arr.indexOf(service_id) !== -1) {
										const environment_id = parseInt(incident_service.environment_id);
										if (!problem_arr[problem_name][service_id].environments) {
											problem_arr[problem_name][service_id].environments = {};
										}
										if (!problem_arr[problem_name][service_id].environments[environment_id]) {
											problem_arr[problem_name][service_id].environments[environment_id] = {
												'environment_id': environment_id,
												'name': (incident_service.environment && incident_service.environment.name ? incident_service.environment.name : ''),
											}
										}
									}
								}
							});
						}

						// Only include the incident if there are actually customer facing services affected, and we have at least one customer-facing business service and capability
						if (affected_services_arr.length > 0) {
							// Get external messages, if any exist
							const events_arr = [];
							if (incident_data.external_communication && incident_data.external_communication.length > 0) {
								let message = '';
								let loc_key;
								incident_data.external_communication.forEach((external_communication_data) => {
									if (external_communication_data.external_communication_template_id && external_communication_data.external_communication_template_id > 0) {
										if (external_communication_data.external_communication_template && external_communication_data.external_communication_template.default_message) {
											message = external_communication_data.external_communication_template.default_message;
										}
										loc_key = external_communication_data.external_communication_template_id;
									} else {
										message = external_communication_data.message;
									}

									const tmp_events_arr = {
										'ts': parseInt(external_communication_data.created_on),
										'msg': message,
										'type': 'cust_msg',
									};
									if (loc_key) {
										tmp_events_arr.loc_key = loc_key;
									}
									events_arr.push(tmp_events_arr);
								});
							}

							// Flatten affected services problems array to remove keys
							Object.keys(affected_services_arr).forEach((key) => {
								if (affected_services_arr[key].problems) {
									affected_services_arr[key].problems = Object.keys(affected_services_arr['problems']).map((problem_key) => {
										return affected_services_arr[key].problems[problem_key];
									});
								}
							});
							incident_arr.push({
								'incident_id': incident_data.incident_id,
								'incident_number': incident_data.incident_number,
								'started_on': parseInt(incident_data.started_on),
								'repaired_on': parseInt(incident_data.repaired_on),
								'resolved_on': parseInt(incident_data.resolved_on),
								'severity': parseInt(incident_data.severity),
								'affected_services': affected_services_arr,
								'problems': problem_arr,
								'events': events_arr,
								'subject_type': '10',
							});
						}
					});

					// Get the global message to display if any
					let global_message = '';

					const data_arr = global_message_api_client.getDataArray();
					if(data_arr.status_message_toggle && data_arr.status_message_text) {
						if(data_arr.status_message_toggle.trim().toLocaleLowerCase() == 'on') {
							global_message = data_arr.status_message_text.trim();
						}
					}

					const incident_json_arr = {
						'global_message': global_message,
						'history_days': this.HISTORY_DAYS,
						'num_hours_issue_is_recent': this.NUM_HOURS_ISSUE_IS_RECENT,
						'incidents': incident_arr,
					};

					incident_json_arr.md5 = crypto.createHash('md5').update(JSON.stringify(incident_json_arr)).digest('hex');
					incident_json_arr.generation_timestamp = moment().unix();

					this.incidents = incident_json_arr;
					callback(null, incident_json_arr);
				} else {
					callback((global_message_api_client.getErrorMessage() ? global_message_api_client.getErrorMessage() : incident_data_api_client.getErrorMessage()));
				}
			});
		});
	}

	/**
	 * Get the maintenance data
	 * @param {function} callback The callback function to call if that will be passed the error and maintenance data
	 */
	getMaintenance(callback) {
		if(this.maintenance && this.maintenance.generation_timestamp > moment().subtract(1, 'minute').unix()) {
			// Use cached version
			callback(null, this.maintenance);
		}

		// Setup an array of valid service IDs to display environments for
		this.getServices((err, services_arr) => {

			const environment_display_service_id_arr = [];
			if(services_arr.services) {
				Object.keys(services_arr.services).forEach((service_id) => {
					if (services_arr.services[service_id].show_environments) {
						environment_display_service_id_arr.push(parseInt(service_id));
					}
				});
			}

			// Get the max history timestamp
			const history_max_timestamp = moment().subtract(this.HISTORY_DAYS, 'days').unix();

			// Get the max future timestamp
			const future_max_timestamp = moment().add(this.FUTURE_DAYS, 'days').unix();

			// Get the list of maintenance events in this date range
			const skms_web_api_client = new SkmsWebApiClient(this.username, this.passkey, this.domain);

			const query = `SELECT maintenance_window_id, maintenance_window_state_id, DATE_FORMAT("U", start_date) AS start_time, DATE_FORMAT("U", end_date) AS end_time, status.status as status_name, cmr.change_type.name,
			cmr.cmr_to_service.service_id, cmr.cmr_to_service.impact_label.value, cmr.cmr_to_service.service_type.name, cmr.cmr_to_service.service.customer_facing, cmr.cmr_to_service.service.active, 
			cmr.cmr_to_service.environment_id, cmr.cmr_to_service.environment.name, cmr.cmr_to_service.environment.environment_type_id, cmr.maintenance_window_announced, cmr.cmr_state_id, DATE_FORMAT("U", cmr.closed_datetime) as cmr.closed_datetime
			WHERE maintenance_type = 1 AND maintenance_window_state_id IN (${this.MW_STATE_ANNOUNCED}, ${this.MW_STATE_COMPLETED}, ${this.MW_STATE_CANCELED}) AND ( (start_date >= DATE(${history_max_timestamp}) AND start_date <= DATE(${future_max_timestamp})) OR (end_date >= DATE(${history_max_timestamp}) AND end_date <= DATE(${future_max_timestamp})) )
			ORDER BY maintenance_window_id DESC, cmr.cmr_to_service.service_id ASC PAGE 1,5000`;

			skms_web_api_client.sendRequest('MaintenanceWindowDao', 'search', {query: query}, () => {
				const maintenance_arr = [];

				if (skms_web_api_client.getResponseStatus() === 'success') {
					const maintenance_data_arr = skms_web_api_client.getDataArray().results;

					// Loop through the Maintenance Window data and build the incident JSON Array
					maintenance_data_arr.forEach((maintenance_data) => {
						let affected_services_arr = {};
						const start_time = parseInt(maintenance_data.start_time);
						const end_time = parseInt(maintenance_data.end_time);

						let max_cmr_closed_time = 0;

						// Loop through each CMR linked to the maintenance
						if (maintenance_data.cmr && maintenance_data.cmr.length > 0) {
							maintenance_data.cmr.forEach((cmr) => {
								const change_type = (cmr.change_type && cmr.change_type.name ? cmr.change_type.name.trim().toLocaleLowerCase() : '');

								// Skip if this CMR is not announced (should not happen...)
								if (cmr.maintenance_window_announced != '1') {
									return;
								}

								// If the maintenance window is not canceled, but the CMR is, skip the CMR
								if (maintenance_data.maintenance_window_state_id != this.MW_STATE_CANCELED && cmr.cmr_state_id == this.CMR_STATE_CANCELED) {
									return;
								}

								if (cmr.cmr_to_service && cmr.cmr_to_service.length > 0) {
									cmr.cmr_to_service.forEach((maintenance_service) => {
										const service_id = parseInt(maintenance_service.service_id);

										// Only look at this record if it is an active customer facing business service
										if (maintenance_service.service.active == '1' && maintenance_service.service.customer_facing == '1' && maintenance_service.service_type.name.toLocaleLowerCase() == 'business service') {
											const impact = (maintenance_service.impact_label && maintenance_service.impact_label.value ? maintenance_service.impact_label.value.trim().toLocaleLowerCase() : '');

											// Skip if this is not a production environment being affected
											if (maintenance_service.environment_id != '0' && maintenance_service.environment.environment_type_id != '1') {
												return;
											}

											// Skip if the change type is not application or the impact is not either high or medium
											if (!(change_type == 'application' || impact == 'high' || impact == 'medium')) {
												return;
											}

											// Create the affected services array item if necessary
											if (affected_services_arr[service_id] === undefined) {
												affected_services_arr[service_id] = {
													'service_id': service_id,
												};
											}

											// Create or add the environment(s)
											if (maintenance_service.environment_id && maintenance_service.environment_id > 0 && environment_display_service_id_arr.indexOf(service_id) !== -1) {
												const environment_id = parseInt(maintenance_service.environment_id);
												if (!affected_services_arr[service_id].environments) {
													affected_services_arr[service_id].environments = {};
												}
												if (!affected_services_arr[service_id].environments[environment_id]) {
													affected_services_arr[service_id].environments[environment_id] = {
														'environment_id': environment_id,
														'name': (maintenance_service.environment && maintenance_service.environment.name ? maintenance_service.environment.name : ''),
													};
												}
											}
										}
									});
								}

								// Update the max CMR closed time if it is greater than the current closed datetime
								const cmr_closed_time = parseInt(cmr.closed_datetime);
								if (cmr_closed_time > max_cmr_closed_time) {
									max_cmr_closed_time = cmr_closed_time;
								}

							});
						}

						// If the max_cmr_closed_time is before the Maintenance start time, and the Maintenance is canceled, do not include it (was canceled before it started)
						if (maintenance_data.maintenance_window_state_id == this.MW_STATE_CANCELED && max_cmr_closed_time <= start_time) {
							affected_services_arr = {};
						}

						// Only include the maintenance if there are actually customer facing services affected
						if (Object.keys(affected_services_arr).length > 0) {
							const now = moment().unix();
							const data_status = maintenance_data.status_name.toLocaleLowerCase();

							let status = '';
							if (start_time <= now && end_time >= now && data_status == 'announced') {
								status = 'ongoing';
							} else if (end_time < now) {
								status = 'completed';
							} else {
								status = data_status;
							}

							// Check if the maintenance ended early
							let real_end_time = end_time;
							if (max_cmr_closed_time > start_time && max_cmr_closed_time < end_time) {
								real_end_time = max_cmr_closed_time;
							} else {
								real_end_time = end_time;
							}

							maintenance_arr.push({
								'maintenance_number': maintenance_data.maintenance_window_id,
								'start_time': start_time,
								'end_time': real_end_time,
								'status': status,
								'affected_services': affected_services_arr,
								'subject_type': '11',
							});
						}
					});

					const maintenance_json_arr = {
						'history_days': this.HISTORY_DAYS,
						'future_days': this.FUTURE_DAYS,
						'maintenance': maintenance_arr,
					};
					maintenance_json_arr.md5 = crypto.createHash('md5').update(JSON.stringify(maintenance_json_arr)).digest('hex');
					maintenance_json_arr.generation_timestamp = moment().unix();

					this.maintenance = maintenance_json_arr;

					callback(null, maintenance_json_arr);
				} else {
					callback(skms_web_api_client.getErrorMessage());
				}
			});
		});
	}
}

module.exports = DataRequestor;
