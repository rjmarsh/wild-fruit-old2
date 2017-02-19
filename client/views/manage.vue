<template>
	<div>
		<wf-manage></wf-manage>
	</div>
</template>

<script>
	import wfManage from '../components/manage-workloads';

	export default {
		name: 'Manage',
		data() {
			return {};
		},
		components: {
			wfManage,
		},
	};
</script>


