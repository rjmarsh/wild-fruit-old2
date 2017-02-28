<template>
	<div class="header">
		<div class="wild_fruit_logo">
			<img class="olive_tree" src="/static/img/olive_tree.png"/><span class="header_text">Wild Fruit</span>
		</div>
		<div class="wild_fruit_status">
			<div v-if="loggedIn" class="FamilySearch_login">
				<div class="FamilySearch_show_login">
					<div @click="logout" class="FamilySearch_show_logout">
						logout
					</div>
					<div class="FamilySearch_username">
						{{username}}
					</div>
				</div>
			</div>
			<div v-else>
				<div @click="login" class="FamilySearch_show_login">
					login
				</div>
			</div>
			<div class="FamilySearch_logo">
				<img class="fsicon" src="/static/img/icons/FamilySearch Logo/FSMosaicTreeLogo.png"/>
			</div>
		</div>
	</div>
</template>

<script>
	import fsClient from '../familysearch/familysearch-client';

	export default {
		name: 'wf-header',
		data() {
			return {
				loggedIn: false,
				username: '',
			};
		},
		created() {
			fsClient.getUser().then(function(user) {
				this.username = user.username;
			}).catch(function(error) {
				console.log(error);
			});
		},
		methods: {
			logout() {
				this.loggedIn = false;
				this.username
				fsClient.logout();
				debugger; // will we ever get here?
			},
			login() {
				this.loggedIn = true;
				this.username = fsClient.getUser();
				fsClient.login();
				debugger; // will we ever get here?
			}
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

	.FamilySearch_login_logout {
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
