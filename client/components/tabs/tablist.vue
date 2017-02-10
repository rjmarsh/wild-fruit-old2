<template>
	<ul :class="classObject" role="tablist">
		<slot></slot>
	</ul>
</template>

<script>
	export default {
		name: 'st-tab-list',
		props: {},
		computed: {
			classObject() {
				return {
					'tab-list': true,
				};
			},
		},
	};
</script>