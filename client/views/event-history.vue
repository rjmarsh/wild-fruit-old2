<template>
	<div>
		<template v-for="date in dates" v-if="timeline[date].has_active || showAll">
		<span class="day_history_date">{{date | formatDate('dddd, MMMM D, YYYY')}}</span>
			<table class="day_history_table">
				<tr v-for="event in timeline[date].events" v-if="event.active || showAll">
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
											<li v-for="capability in prob.service.capabilities" v-if="capability === serviceId">
												{{prob.service.service_name}} {{prob.environments | concatEnvironments}}
											</li>
										</template>
									</ul>
								</template>
							</template>
							<template v-else-if="event.affected_services">
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
	</div>
</template>

<script>
	import filters from '../components/filters';

	export default {
		name: 'st-event-history',
		props: {
			serviceId: {
				type: Number,
			},
			dates: {
				type: Array,
				default: [],
			},
			timeline: {
				type: Object,
				default: {},
			},
			showAll: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {};
		},
		mixins: [filters],
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
</style>
