<template>
	<div class="footer">
		<img src="/static/img/olive_branch_2.png">
	</div>
</template>

<script>
	export default {
		name: 'wf-footer',
		data() {
			return {};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.footer {
		position: absolute;
		bottom: 0;
		border-top: solid 1px rgba(255, 255, 255, .2);
		font-size: 14px;
		box-sizing: border-box;
		width: 1000px;
	}

	img {
		height: 5.5em;
		vertical-align: middle;
		padding-right: 3px;
	}

</style>
