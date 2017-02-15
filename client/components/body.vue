<template>
	<div class="body">
		<div>
			<img id="one" src="/static/img/olive_branch.jpg">
		</div>
		<div>
			<img id="two" src="/static/img/olive_tree.png">
		</div>
	</div>
</template>

<script>
	export default {
		name: 'wf-body',
		data() {
			return {};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.body {
		background-color: #ffffff;
		border: 1px solid #f3f4f5;
		border-radius: 6px;
		box-shadow: 0 1px 0 0 rgba(35, 31, 32, .12);

		margin-bottom: 20px;
	}

	.one {
		height: 40.0em;
		padding-right: 1px;
	}

	.two {
		height: 60.0em;
		padding-right: 1px;
	}
</style>
