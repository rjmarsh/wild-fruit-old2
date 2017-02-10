<template>
	<div v-if="service" class="service_box">
		<div class="column_container cloud_box">
			<div class="left">
				<st-service-img :has-icon="service.has_icon" :service-id="service.service_id" class="cloud_service_icon"></st-service-img>
				<span class="cloud_name large">{{service.service_name}}</span>
			</div>
		</div>
		<st-tabs>
			<st-tab-pane label="Current" selected>
				<template v-for="solution in service.sols">
					<div class="column_container solution_box">
						<div class="left">
							<st-service-img :has-icon="service.has_icon" :service-id="solution.service_id" class="solution_service_icon"></st-service-img>
							<span class="solution_name">{{solution.service_name}}</span>
						</div>
					</div>
					<div v-for="capability in solution.caps"
						 class="column_container capability_box">
						<div class="left">
							<span class="capability_name">
								<router-link :to="capability.url">{{capability.service_name}}</router-link>
							</span>
						</div>
						<div class="right">
							<st-service-status
								:major-issues="capability.relevant_incidents.major_issues"
								:minor-issues="capability.relevant_incidents.minor_issues"
								:recently-resolved-issues="capability.relevant_incidents.recently_resolved"
								:ongoing-maintenance="capability.relevant_maintenance.ongoing"
							></st-service-status>
						</div>
					</div>
				</template>
			</st-tab-pane>
			<st-tab-pane label="History">
				<div class="service_history_scroll_arrows">
					<img src="/static/img/icons/left_arrow.png" @click="scroll('left')" data-direction="left">
					<img src="/static/img/icons/right_arrow.png" @click="scroll('right')"  data-direction="right">
				</div>
				<div class="service_history_wrapper">
					<div class="service_history_left_column">
						<div class="service_history_header_row"></div>
						<template v-for="(solution, index) in service.sols">
							<div v-if="index !== 0" class="service_history_border_row"></div>
							<div class="service_history_solution_row">
								<st-service-img :has-icon="service.has_icon" :service-id="solution.service_id" class="solution_service_icon"></st-service-img><span class="solution_name">{{solution.service_name}}</span>
							</div>
							<div v-for="(capability, capIndex) in solution.caps" class="service_history_capability_row">
								<span class="capability_name">
									<router-link :to="capability.url">{{capability.service_name}}</router-link>
								</span>
							</div>
						</template>
					</div>
					<div class="service_history_right_column" ref="historyColumn">
						<table class="service_history_table">
							<tbody>
								<tr class="service_history_header_row">
									<td v-for="day in historyDays">{{day}}</td>
								</tr>
								<template v-for="(solution, index) in service.sols">
									<tr v-if="index !== 0" class="service_history_border_row">
										<td v-for="day in historyDays">&nbsp;</td>
									</tr>
									<tr class="service_history_solution_row">
										<td v-for="day in historyDays">&nbsp;</td>
									</tr>
									<tr v-for="capability in solution.caps" class="service_history_capability_row">
										<td v-for="day in historyDays">
											<st-service-status
												mode="history"
												:major-issues="capability.relevant_incidents.major_issues"
												:minor-issues="capability.relevant_incidents.minor_issues"
												:recently-resolved-issues="capability.relevant_incidents.recently_resolved"
												:ongoing-maintenance="capability.relevant_maintenance.ongoing"
											></st-service-status>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
				</div>
			</st-tab-pane>
			<st-tab-pane label="Planned">
					<template v-if="service.relevant_maintenance.upcoming.length">
						<st-planned-maintenance :upcoming-maintenance="service.relevant_maintenance.upcoming"></st-planned-maintenance>
					</template>
					<div v-else class="no_issues">No upcoming maintenance currently planned.</div>
				</st-tab-pane>
			</st-tab-pane>
		</st-tabs>
	</div>
</template>

<script>
	import stTabs from '../components/tabs/tabs';
	import stTabPane from '../components/tabs/tabpane';
	import stServiceImg from '../components/service-image';
	import stServiceStatus from '../components/service-status-render';
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
			const result = [];
			for(let i = 0; i < this.incidentHistoryDays; i++) {
				result.push(moment().subtract(i, 'day').startOf("day").format('M/D'));
			}
			return {
				historyDays: result,
			};
		},
		methods: {
			scroll(direction) {
				const currentPosition = this.$refs.historyColumn.scrollLeft;
				const colWidth = this.$refs.historyColumn.querySelector('td').offsetWidth;
				const windowWidth = this.$refs.historyColumn.offsetWidth;
				let newScrollPos = 0;
				if (direction === 'left') {
					newScrollPos = Math.ceil((currentPosition - windowWidth) / colWidth) * colWidth;
				} else if (direction === 'right') {
					newScrollPos = Math.floor((currentPosition + windowWidth) / colWidth) * colWidth;
				}
				this.$refs.historyColumn.scrollLeft = newScrollPos;
			},
		},
		components: {
			stTabs,
			stTabPane,
			stServiceImg,
			stServiceStatus,
			stPlannedMaintenance,
		},
	};
</script>

<style scoped>
	.no_issues {
		padding: 30px;
		font-style: italic;
	}
</style>