<template>
	<div class="service_box">
		<router-link :to="service.url">
			<div class="column_container cloud_box">
				<div class="left">
					<st-service-img :has-icon="service.has_icon" :service-id="service.service_id"></st-service-img>
					<span class="cloud_name">{{service.service_name}}</span>
				</div>
				<div class="right">
					<st-service-status
						service-type="cloud"
						:major-issues="service.relevant_incidents.major_issues"
						:minor-issues="service.relevant_incidents.minor_issues"
						:recently-resolved-issues="service.relevant_incidents.recently_resolved"
						:ongoing-maintenance="service.relevant_maintenance.ongoing"
					></st-service-status>
				</div>
			</div>
		</router-link>
		<template v-for="solution in service.sols" v-if="shouldDisplay(solution)">
			<div class="column_container solution_box">
				<div class="left">
					<st-service-img :has-icon="service.has_icon" :service-id="solution.service_id" class="solution_service_icon"></st-service-img>
					<span class="solution_name">{{solution.service_name}}</span>
				</div>
			</div>
			<div v-for="capability in solution.caps" v-if="shouldDisplay(capability)"
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
		<div v-for="capability in service.caps" v-if="shouldDisplay(capability)"
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
	</div>
</template>

<script>
	import stServiceImg from './service-image';
	import stServiceStatus from './service-status-render';

	export default {
		components: {
			stServiceImg,
			stServiceStatus,
		},
		name: 'st-service',
		props: ['service'],
		data() {
			return {};
		},
		methods: {
			shouldDisplay(service) {
				return service.relevant_incidents.recently_resolved.length
					+ service.relevant_incidents.ongoing.length
					+ service.relevant_maintenance.ongoing.length;
			},
		},
	};
</script>

<style scoped>
	.service_box {
		background-color: #ffffff;
		border: 1px solid #f3f4f5;
		border-radius: 6px;
		box-shadow: 0 1px 0 0 rgba(35, 31, 32, .12);

		margin-bottom: 20px;
	}

	.solution_name {
		font-weight: bold;
		font-size: 15px;
		color: #232323;
		opacity: .65;
		vertical-align: middle;
		display: inline-block;
	}

	.capability_name {
		font-size: 15px;
		color: #232323;
		opacity: .63;
		vertical-align: middle;
		display: inline-block;
	}

	.cloud_name {
		font-weight: bold;
		font-size: 20px;
		color: #373737;
		vertical-align: middle;
		display: inline-block;
	}
</style>
