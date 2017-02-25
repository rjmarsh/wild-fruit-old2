<template>
	<div class="header">
		<div class="wild_fruit_logo">
			<img class="olive_tree" src="/static/img/olive_tree.png"/><span class="header_text">Wild Fruit</span>
		</div>
		<div class="wild_fruit_status">
			<div class="FamilySearch_login">
				<div class="FamilySearch_signin_signout">logout</div>
				<div class="FamilySearch_username">rjmarsh</div>
			</div>
			<div class="FamilySearch_logo">
				<img class="fsicon" src="/static/img/icons/FamilySearch Logo/FSMosaicTreeLogo.png"/>
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
		line-height: 2.25em;
		width: 100%;
	}

	.wild_fruit_logo {
		flex: 2;
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

	.wild_fruit_status {
		flex: 3;
	}


	.FamilySearch_login {
		display: flex;
		height: 50%;
	}

	.FamilySearch_username {
		flex: 1;
		order: 1;
		flex-basis: 85%;
		text-align: right;
		font-size: 14px;
		font-family: "Georgia";
	}

	.FamilySearch_signin_signout {
		flex: 1;
		order: 2;
		flex-basis: 15%;
		text-align: right;
		padding-right: 5px;
		font-size: 14px;
		font-family: "Georgia";
	}

	.FamilySearch_logo {
		display: flex;
		height: 50%;
	}

	img.fsicon {
		height: 2.0em;
		padding-right: 5px;
		margin-left: auto;
	}


</style>
