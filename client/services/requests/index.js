import servicesService from './services';
import maintenanceService from './maintenance';
import incidentsService from './incidents';

const INCIDENT_RECENT_HOURS = 4;
const MAINTENANCE_FUTURE_DAYS = 2;

const INCIDENT_RECENT_SECONDS = INCIDENT_RECENT_HOURS * 60 * 60;
const MAINTENANCE_FUTURE_SECONDS = MAINTENANCE_FUTURE_DAYS * 24 * 60 * 60;

const NOW = (+new Date() / 1000);
const CUR = (+new Date() / 1000);

/**
 * getServices renders the service data
 * @param  {object} serviceData data
 * @param  {object} incidentsData data
 * @param  {object} maintenanceData data
 * @return {array} rendered result
 */
function getServices(serviceData, incidentsData, maintenanceData) {
	let ongoingIssues = 0;

	/**
	 * structureService structures a service
	 * @param  {int} serviceId the service id
	 * @return {object} a structured service
	 */
	const structureService = (serviceId) => {
		const serv = serviceData.services[serviceId];
		serv.relevant_incidents = {
			recently_resolved: [],
			all: [],
			ongoing: [],
			major_issues: [],
			minor_issues: [],
		};
		serv.relevant_maintenance = {
			ongoing: [],
			upcoming: [],
			all: [],
		};
		if (serv.all_business_services === undefined) {
			serv.all_business_services = [];
		}
		for (let v = 0; v < incidentsData.incidents.length; v += 1) {
			const incident = incidentsData.incidents[v];
			for (let f = 0; f < incident.affected_services.length; f += 1) {
				const affectedServiceIds = incident.affected_services[f];
				if (serv.all_business_services.indexOf(parseInt(affectedServiceIds, 10)) !== -1) {
					serv.relevant_incidents.all.push(incident);
					if (incident.resolved_on === 0) {
						if (incident.severity === 1) {
							serv.relevant_incidents.major_issues.push(incident);
						} else if (incident.severity === 2) {
							serv.relevant_incidents.minor_issues.push(incident);
						}
						ongoingIssues += 1;
						serv.relevant_incidents.ongoing.push(incident);
					} else if ((incident.resolved_on + INCIDENT_RECENT_SECONDS) >= NOW) {
						serv.relevant_incidents.recently_resolved.push(incident);
					}
					break;
				}
			}
		}

		for (let s = 0; s < maintenanceData.maintenance.length; s += 1) {
			const maintenance = maintenanceData.maintenance[s];
			const affectedServiceIds = Object.keys(maintenance.affected_services);
			for (let z = 0; z < affectedServiceIds.length; z += 1) {
				if (serv.all_business_services.indexOf(parseInt(affectedServiceIds[z], 10)) !== -1) {
					serv.relevant_maintenance.all.push(maintenance);
					if (maintenance.status === 'announced' || maintenance.status === 'ongoing') {
						if (maintenance.start_time < CUR && maintenance.end_time > CUR) {
							serv.relevant_maintenance.ongoing.push(maintenance);
						} else if (maintenance.start_time - MAINTENANCE_FUTURE_SECONDS <= CUR) {
							serv.relevant_maintenance.upcoming.push(maintenance);
						}
					}
					break;
				}
			}
		}
		return serv;
	};
	const allServices = {};
	const searchItems = [];
	for (let i = 0; i < incidentsData.incidents.length; i++) {
		const incident = incidentsData.incidents[i];
		if (incident.affected_services) {
			incident.affected_services_ref = new Array(incident.affected_services.length);
			for (let af = 0; af < incident.affected_services.length; af++) {
				incident.affected_services_ref[af] = serviceData.services[incident.affected_services[af]];
			}
		}
		if (incident.problems) {
			const incidentProblemKeys = Object.keys(incident.problems);
			for (let zf = 0; zf < incidentProblemKeys.length; zf += 1) {
				const incidentProblem = incident.problems[incidentProblemKeys[zf]];
				const incidentProblemServiceIds = Object.keys(incidentProblem);
				for (let fg = 0; fg < incidentProblemKeys.length; fg += 1) {
					const prob = incidentProblem[incidentProblemServiceIds[fg]];
					prob.service = serviceData.services[prob.service_id];
				}
			}
		}
	}
	for (let iv = 0; iv < maintenanceData.maintenance.length; iv++) {
		const maintenance = maintenanceData.maintenance[iv];
		if (maintenance.affected_services) {
			const maintenanceProblemKeys = Object.keys(maintenance.affected_services);
			for (let zf = 0; zf < maintenanceProblemKeys.length; zf += 1) {
				const maintenanceProblem = maintenance.affected_services[maintenanceProblemKeys[zf]];
				maintenanceProblem.service = serviceData.services[maintenanceProblem.service_id];
			}
		}
	}
	const keys = Object.keys(serviceData.services);
	for (let zf = 0; zf < keys.length; zf += 1) {
		const service = structureService(keys[zf]);
		if (service.url) {
			allServices[service.url] = service;
		}
		serviceData.services[keys[zf]] = service;
		if (service.service_name) {
			searchItems.push(service.service_name);
		}
	}

	const services = new Array(serviceData.clouds.length);

	for (let i = 0; i < serviceData.clouds.length; i += 1) {
		const serv = serviceData.services[serviceData.clouds[i]];
		if (!serv.capabilities) {
			serv.capabilities = [];
		}
		const solutions = serv.solutions;
		const capabilities = serv.capabilities;

		serv.sols = new Array(solutions.length);
		serv.caps = new Array(capabilities.length);

		for (let sh = 0; sh < solutions.length; sh += 1) {
			const solution = serviceData.services[solutions[sh]];
			serv.sols[sh] = solution;
			const solCapabilities = solution.capabilities;
			solution.caps = new Array(solution.capabilities.length);
			for (let o = 0; o < solCapabilities.length; o += 1) {
				solution.caps[o] = serviceData.services[solCapabilities[o]];
			}
		}
		for (let f = 0; f < capabilities.length; f += 1) {
			serv.caps[f] = serviceData.services[capabilities[f]];
		}
		services[i] = serv;
	}
	return [services, searchItems, incidentsData.global_message, allServices, ongoingIssues];
}

export default {
	getFormattedData() {
		return Promise.all([
			servicesService.get(),
			incidentsService.get(),
			maintenanceService.get(),
		]).then(allData => getServices(allData[0], allData[1], allData[2]));
	},
};
