<template>
	<div class="header">
		<router-link to="/">
			<img src="/static/img/olive_tree.png"/><span class="localize_text header_text">Wild Fruit</span>
		</router-link>
		<span id="breadcrumb"></span>
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
		background-color: #A4A6A9;
		color: #ffffff;
		padding: 15px;
		line-height: 2.25em;
	}

	img {
		height: 10.5em;
		vertical-align: middle;
		padding-right: 3px;
	}
	.header_text {
		margin-left:20px;
		font-size: 50px;
	}
</style>
