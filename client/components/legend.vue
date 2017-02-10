<template>
	<div class="legend">
		<div><img src="/static/img/icons/normal.png"><span class="icon_label">Normal</span></div>
		<div><img src="/static/img/icons/minor_issue.png"><span class="icon_label">Minor Incident</span></div>
		<div><img src="/static/img/icons/major_issue.png"><span class="icon_label">Major Incident</span></div>
		<div><img src="/static/img/icons/event.png"><span class="icon_label">Reported Event</span></div>
		<div><img src="/static/img/icons/maintenance.png"><span class="icon_label">Maintenance</span></div>
	</div>
</template>

<script>
	export default {
		name: 'st-legend',
		data() {
			return {};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.legend {
		padding: 20px;
		text-align: center;
	}

	.legend div {
		display: inline-block;
	}

	.legend div:not(:last-child) {
		padding-right: 55px;
	}

	.legend img {
		padding-right: 5px;
		vertical-align: middle;
	}

	.legend span {
		font-size: 13px;
		vertical-align: middle;
		color: #4c4b4c;
		opacity: .70;
	}
</style>
