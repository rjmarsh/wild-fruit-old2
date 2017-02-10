<template>
	<div>
		<st-service-box v-for="service in services" :service="service"></st-service-box>
	</div>
</template>

<script>
	import stServiceBox from '../components/service-box';

	export default {
		name: 'main',
		props: {
			services: {
				type: Array,
				default: [],
			},
		},
		data() {
			return {};
		},
		components: {
			stServiceBox,
		},
	};
</script>