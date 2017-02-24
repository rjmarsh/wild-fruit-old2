<template>
	<div class="header">
		<img class="olive_tree" src="/static/img/olive_tree.png"/><span class="localize_text header_text">Wild Fruit</span>
	</div>
</template>

<script>
	export default {
		name: 'wf-header',
		data() {
			return {};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.header {
		display: table;
		background-color: #5A6100;
		color: #ffffff;
		padding: 15px;
		line-height: 2.25em;
		width: 100%;
	}

	img {
		height: 6.0em;
		vertical-align: middle;
		padding-right: 1px;
	}

	header.header_text {
		margin-left:20px;
		font-size: 30px;
		font-family: "Georgia";
	}

</style>
