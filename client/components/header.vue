<template>
	<div class="header">
		<div class="wild_fruit_logo">
			<img class="olive_tree" src="/static/img/olive_tree.png"/><span class="header_text">Wild Fruit</span>
		</div>
		<div class="wild_fruit_status">
			<div class="FamilySearch_login">
				<div class="FamilySearch_logo">familysearchlogo</div>
				<div class="FamilySearch_signin_signout">logout</div>
				<div class="FamilySearch_username">rjmarsh</div>
			</div>
		</div>
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
		display: flex;
		background-color: #5A6100;
		color: #ffffff;
		padding: 15px;
		line-height: 2.25em;
		width: 100%;
	}

	.wild_fruit_logo {
		flex: 1;
	}

	.wild_fruit_status {
		flex: 3;
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

	.FamilySearch_login {
		display: flex;
	}

	.FamilySearch_logo {
		flex: 2;
		vertical-align: middle;
	}

	.FamilySearch_signin_signout {
		flex: 1;
	}

	.FamilySearch_username {
		flex: 1;
	}

</style>
