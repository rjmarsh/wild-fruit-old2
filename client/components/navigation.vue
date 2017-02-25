<template>
	<div class="nav_container">
		<div class="nav_link"><a href="\">Current Workflow</a></div>
		<div class="nav_link"><a href="\create-workflow">Create a New Workflow</a></div>
		<div class="nav_link"><a href="\manage-workflows">Manage Workflows</a></div>
		<div class="nav_link"><a href="\learn">Learn</a></div>
	</div>
</template>

<script>
	export default {
		name: 'wf-navigate',
		data() {
			return {};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

	.nav_container {
		display: flex;
		background-color: #d1d7b3;
		height: 45px;
		justify-content: space-around;
		margin-top: 40px;
		margin-bottom: 40px;
		margin-left:auto;
		margin-right:auto;
		width: 80%;
	}

	.nav_link {
		align-self: center;
	}

	a {
		color: #5a6100;
	}

	a:link {
		text-decoration: none;
	}

	a:hover {
   		text-decoration: underline;
	}

</style>
