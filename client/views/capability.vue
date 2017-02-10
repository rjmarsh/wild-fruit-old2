<template>
	<div v-if="service" class="service_box">
		<div class="column_container cloud_box">
			<div class="left">
				<st-service-img :has-icon="service.has_icon" :service-id="parentId" class="cloud_service_icon"></st-service-img>
				<span class="cloud_name large">{{service.service_name}}</span>
			</div>
		</div>
		<st-tabs>
			<st-tab-pane label="Ongoing">
			<template v-if="activeIssueCount">
				<template v-for="date in dates" v-if="timeline[date].has_active">
				<span class="day_history_date">{{date | formatDate('dddd, MMMM D, YYYY')}}</span>
					<table class="day_history_table">
						<tr v-for="event in timeline[date].events" v-if="event.active">
							<td v-if="event.timestamp">
								{{event.timestamp | formatDate('LT')}}
							</td>
							<td v-else>
								All Day
							</td>
							<td>
								<div class="day_history_event_title">
									<img :src="`/static/img/icons/${event.icon}.png`" class="event_icon" />
									<span class="event_title">{{event.title}}</span>
								</div>
								<div class="day_history_event_content">
									<div>{{event.description}}</div>
									<template v-if="event.problems">
										<template v-for="(problem, problemType) in event.problems">
											<span class="problem">{{problemType}}</span>
											<ul class="affected_services">
												<template v-for="prob in problem">
													<li v-for="capability in prob.service.capabilities">
														{{prob.service.service_name}} {{prob.environments | concatEnvironments}}
													</li>
												</template>
											</ul>
										</template>
									</template>
									<template v-else-if="event.affected_services_ref">
										<template v-for="affected_service in event.affected_services_ref">
											<ul class="affected_services">
													<li v-for="capability in affected_service.capabilities">
														{{affected_service.service_name}} {{affected_service.environments | concatEnvironments}}
													</li>
											</ul>
										</template>
									</template>
									<button v-if="event.can_subscribe" type="button" class="subscribe_button">Subscribe to this Incident</button>
								</div>
							</td>
						</tr>
					</table>
					<br />
				</template>
			</template>
			<template v-else>
				<div class="no_issues">There are currently no ongoing service events.</div>
			</template>
			</st-tab-pane>
			<st-tab-pane label="History" selected>
				<template v-if="dates.length">
					<template v-for="date in dates">
						<span class="day_history_date">{{date | formatDate('dddd, MMMM D, YYYY')}}</span>
						<table class="day_history_table">
							<tr v-for="event in timeline[date].events">
								<td v-if="event.timestamp">
									{{event.timestamp | formatDate('LT')}}
								</td>
								<td v-else>
									All Day
								</td>
								<td>
									<div class="day_history_event_title">
										<img :src="`/static/img/icons/${event.icon}.png`" class="event_icon" />
										<span class="event_title">{{event.title}}</span>
									</div>
									<div class="day_history_event_content">
										<div>{{event.description}}</div>
										<template v-if="event.problems">
											<template v-for="(problem, problemType) in event.problems">
												<span class="problem">{{problemType}}</span>
												<ul class="affected_services">
													<template v-for="prob in problem" v-if="prob.service">
														<li v-for="capability in prob.service.capabilities" v-if="capability === service.service_id">
															{{prob.service.service_name}} {{prob.environments | concatEnvironments}}
														</li>
													</template>
												</ul>
											</template>
										</template>
										<template v-else-if="event.affected_services">
											<template v-for="(affected_service, service_id) in event.affected_services">
												<ul class="affected_services">
													<template v-if="affected_service.service">
														<li v-for="capability in affected_service.service.capabilities" v-if="capability === service.service_id">
															{{affected_service.service.service_name}} {{affected_service.environments | concatEnvironments}}
														</li>
													</template>
												</ul>
											</template>
										</template>
										<button v-if="event.can_subscribe" type="button" class="subscribe_button">Subscribe to this Incident</button>
									</div>
								</td>
							</tr>
						</table>
						<br />
					</template>
				</template>
				<div v-else class="no_issues">No incidents have occured in the past {{incidentHistoryDays}} days.</div>
			</st-tab-pane>
			<st-tab-pane label="Planned">
				<template v-if="service.relevant_maintenance.upcoming.length">
					<st-planned-maintenance :upcoming-maintenance="service.relevant_maintenance.upcoming"></st-planned-maintenance>
				</template>
				<div v-else class="no_issues">No upcoming maintenance currently planned.</div>
			</st-tab-pane>
		</st-tabs>
	</div>
</template>

<script>
	import stTabs from '../components/tabs/tabs';
	import stTabPane from '../components/tabs/tabpane';
	import stServiceImg from '../components/service-image';
	import stServiceStatus from '../components/service-status-render';
	import filters from '../components/filters';
	import stPlannedMaintenance from './planned-maintenance';

	import moment from 'moment';

	export default {
		name: 'main',
		props: {
			service: {
				default: null,
			},
			incidentHistoryDays: {
				type: Number,
				default: 40,
			},
		},
		data() {
			const {
				timeline,
				dates,
				activeIssueCount,
			} = this.getServiceHistory(
				this.service.relevant_incidents.all,
				this.service.relevant_maintenance.all,
				true,
			);
			return {
				timeline: timeline,
				dates: dates,
				activeIssueCount: activeIssueCount,
			};
		},
		computed: {
			parentId() {
				return this.service.parents[0];
			},
		},
		mixins: [filters],
		components: {
			stTabs,
			stTabPane,
			stServiceImg,
			stServiceStatus,
			stPlannedMaintenance,
		},
		methods: {
			getServiceHistory(incident_data, maintenance_data, ignore_ongoing) {
				const self = this;
				const timeline = {};
				let activeIssueCount = 0;
				const dates = [];

				/**
				 * addEvent adds an event to the timeline
				 * @param {date} date the date of the event
				 * @param {object} event the event
				 */
				function addEvent(date, event) {
					date = date.unix();

					if(!timeline[date]) {
						timeline[date] = {events: [], has_active: false};
						dates.push(date);
					}

					timeline[date].events.push(event);
					if(event.active) {
						timeline[date].has_active = true;
					}
				}

				incident_data.forEach(function(incident) {
					const is_recently_resolved = moment.unix(incident.resolved_on).add(self.incidentHistoryDays, 'hours') >= moment();
					if (incident.resolved_on == 0 || is_recently_resolved) {
						activeIssueCount++;
					}

					if(incident.started_on > 0) {
						addEvent(moment.unix(incident.started_on).startOf('day'), {
							title: `Incident ${incident.incident_number} was opened.`,
							description: 'We are investigating a reported incident affecting the following:',
							affected_services: incident.affected_services,
							problems: incident.problems,
							timestamp: incident.started_on,
							icon: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
							severity: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
							active: incident.resolved_on == 0 || is_recently_resolved,
							subject_type: incident.subject_type,
							subject_id: incident.incident_id,
							can_subscribe: incident.resolved_on == 0
						});
					}
					if (incident.repaired_on > 0 && incident.repaired_on != incident.resolved_on) {
						addEvent(moment.unix(incident.repaired_on).startOf('day'), {
							title: `Incident ${incident.incident_number} was repaired.`,
							description: 'We have identified and repaired the problems related to this incident. Some customers may still experience issues while the service is being restored to optimal levels for the following:',
							affected_services: incident.affected_services,
							problems: incident.problems,
							timestamp: incident.repaired_on,
							icon: 'event',
							severity: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
							active: incident.resolved_on == 0 || is_recently_resolved,
							subject_type: incident.subject_type,
							subject_id: incident.incident_id,
							can_subscribe: false
						});
					}
					if (incident.resolved_on > 0) {
						addEvent(moment.unix(incident.resolved_on).startOf('day'), {
							title: `Incident ${incident.incident_number} was resolved.`,
							description: 'We have resolved the incident affecting the following:',
							affected_services: incident.affected_services,
							problems: incident.problems,
							timestamp: incident.resolved_on,
							icon: 'normal',
							severity: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
							active: is_recently_resolved,
							subject_type: incident.subject_type,
							subject_id: incident.incident_id,
							can_subscribe: false
						});
					}
					if (!ignore_ongoing) {
						const date = moment.unix(incident.started_on).startOf('day').add(1, 'day');
						let end_date;
						if(incident.resolved_on > 0) {
							end_date = moment.unix(incident.resolved_on).startOf('day');
						} else {
							end_date = moment();
						}

						while(date < end_date) {
							addEvent(date, {
								title: `Incident ${incident.incident_number} ongoing.`,
								description: 'We have an ongoing incident affecting the following:',
								affected_services: incident.affected_services,
								problems: incident.problems,
								icon: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
								severity: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
								active: incident.resolved_on == 0,
								subject_type: incident.subject_type,
								subject_id: incident.incident_id,
								can_subscribe: incident.resolved_on == 0
							});

							date.add(1, 'day');
						}
					}
					if(incident.events) {
						incident.events.forEach(function(event) {
							console.log(event);
							addEvent(moment.unix(event.ts).startOf('day'), {
								title: 'An unknown event has occurred.',
								// TODO
								description: '',
								timestamp: event.ts,
								icon: 'event',
								severity: (incident.severity == 1 ? 'major_issue' : 'minor_issue'),
								active: incident.resolved_on == 0 || is_recently_resolved,
								subject_type: incident.subject_type,
								subject_id: incident.incident_id,
								can_subscribe: false
							});
						});
					}
				});

				maintenance_data.forEach(function(maintenance) {
					if(maintenance.start_time <= moment().unix() && maintenance.end_time > moment().unix()) {
						activeIssueCount++;
					}
					if (maintenance.start_time > 0 && maintenance.start_time <= moment().unix()) {
						addEvent(moment.unix(maintenance.start_time).startOf('day'), {
							title: `Maintenance ${maintenance.maintenance_number} was started.`,
							description: 'Maintenance started for the following:',
							affected_services: maintenance.affected_services,
							timestamp: maintenance.start_time,
							icon: 'maintenance',
							severity: 'maintenance',
							active: maintenance.end_time > moment().unix(),
							subject_type: maintenance.subject_type,
							subject_id: maintenance.maintenance_window_id
						});
					}
					if (maintenance.end_time > 0 && maintenance.end_time <= moment().unix()) {
						addEvent(moment.unix(maintenance.end_time).startOf('day'), {
							title: `Maintenance ${maintenance.maintenance_number} was completed.`,
							description: 'Maintenance was completed for the following:',
							affected_services: maintenance.affected_services,
							timestamp: maintenance.end_time,
							icon: 'maintenance',
							severity: 'maintenance',
							active: false,
							subject_type: maintenance.subject_type,
							subject_id: maintenance.maintenance_number
						});
					}
				});
				for(const i in timeline) {
					if(timeline.hasOwnProperty(i)) {
						timeline[i].events = timeline[i].events.sort(function(a,b) {
							if(b.timestamp === undefined) {
								return -1;
							} else if (a.timestamp === undefined) {
								return 1;
							}
							return b.timestamp - a.timestamp;
						});
					}
				}
				return {
					timeline: timeline,
					dates: dates.sort((a,b) => b - a),
					activeIssueCount: activeIssueCount
				};
			}
		}
	};
</script>
<style scoped>
	.event_title {
		vertical-align: middle;
		display: inline-block;
		white-space: normal;
		font-weight: bold;
	}
	.event_icon {
		vertical-align: middle;
		padding-right: 3px;
	}
	.subscribe_button {
		margin-top: 15px;
	}
	.no_issues {
		padding: 30px;
		font-style: italic;
	}
</style>