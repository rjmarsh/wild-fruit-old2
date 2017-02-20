<template>
	<div>
		<table class="center">
			<tr>
				<td>
					<a href="\" class="button">Current Workflow</a>
				</td>
				<td>
					<a href="\create-workflow" class="button">Create a New Workflow</a>
				</td>
				<td>
					<a href="\manage-workflows" class="button">Manage Workflows</a>
				</td>
			</tr>
		</table>
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

	 table.center {
    	margin-left:auto;
    	margin-right:auto;
    	width:700px;
    	height: 45px;
		background-color: #d1d7b3;
  	}

	table {
		margin-top: 40px;
		margin-bottom: 40px;
		border: 2px solid #5A6100;	}

	tr {text-align:center;}

	a {
		color: #5a6100;
	}
	a:hover {
   		text-decoration: underline;
	}

</style>
