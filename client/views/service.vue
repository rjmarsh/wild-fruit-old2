<template>
	<div v-if="service">
		<template v-if="service.type === 'cloud'">
			<st-cloud :service="service"></st-cloud>
		</template>
		<template v-if="service.type === 'capability'">
			<st-capability :service="service"></st-capability>
		</template>		
	</div>
</template>

<script>
	import stCloud from './cloud';
	import stCapability from './capability';

	export default {
		name: 'service',
		props: ['service_id'],
		data() {
			return {
			};
		},
		computed: {
			service() {
				return this.$root.$data.allServices[`\/${this.service_id}`];
			},
		},
		components: {
			stCloud,
			stCapability,
		},
	};
</script>