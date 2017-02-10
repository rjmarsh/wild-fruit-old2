<template>
	<table class="planned_maintenance_table">
		<thead>
			<tr>
				<th>SERVICES</th>
				<th>DATE</th>
				<th>ID NUMBER</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
				<tr v-for="upcoming in upcomingMaintenance">
					<td>
						<ul v-for="affected_service in upcoming.affected_services" v-if="affected_service.service">
							<li v-for="capability in affected_service.service.capabilities">
								{{affected_service.service.service_name}} {{affected_service.environments | concatEnvironments}}
							</li>
						</ul>
					</td>
					<td class="nowrap">
						<template v-if="upcoming.start_time === upcoming.end_time">
							<strong>{{upcoming.start_time | formatDate('L')}}</strong>
							<br />
							<span class="date-span">{{upcoming.start_time | formatDate('L')}} - {{upcoming.end_time | formatDate('L')}}</span>
						</template>
						<template v-else>
							<div class="flex-center">
								<div>
									<strong>{{upcoming.start_time | formatDate('L')}}</strong><br />
									<span class="date-span">{{upcoming.start_time | formatDate('L')}}</span>
								</div>
								<div class="hyphen">
									-
								</div>
								<div>
									<strong>{{upcoming.end_time | formatDate('L')}}</strong><br />
									<span class="date-span">{{upcoming.end_time | formatDate('L')}}</span>
								</div>
							</div>
						</template>
					</td>
					<td>
						#{{upcoming.maintenance_number}}
					</td>
				</tr>
		</tbody>
	</table>
</template>

<script>
	import filters from '../components/filters';

	export default {
		name: 'st-planned-maintenance',
		props: {
			upcomingMaintenance: {
				type: Array,
				default: [],
			},
		},
		data() {
			return {};
		},
		mixins: [filters],
	};
</script>

<style scoped>
	.date-span {
		color: #4c4b4c;
		opacity: .70;
		white-space: nowrap;
	}
	.hyphen {
		padding: 0 6px;
	}
	.nowrap {
		white-space: nowrap;
	}
	.flex-center {
		display: flex;
		align-items: center;
	}
</style>
