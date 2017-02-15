<template>
	<div class="header">
		<router-link to="/">
			<!-- Each of these elements (img and span) is a link to "/". Honestly not very interesting unless we end up with multiple virtual pages. -->
			<img src="/static/img/olive_tree.png"/><span class="localize_text header_text">Wild Fruit</span>
		</router-link>
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
		background-color: #5A6100;
		color: #ffffff;
		padding: 15px;
		line-height: 2.25em;
	}

	img {
		height: 6.0em;
		vertical-align: middle;
		padding-right: 1px;
	}
	.header_text {
		margin-left:20px;
		font-size: 30px;
		font-family: "Georgia";
	}
</style>
