<template>
	<img :src="`/static/img/service_icons/${imgId}.png`" class="service_icon" @error="imgId = 'no_icon'">
</template>

<script>
	export default {
		name: 'st-service-img',
		props: {
			serviceId: {
				default: '',
			},
			hasIcon: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			let imgId = this.serviceId;
			if (!this.hasIcon) {
				imgId = 'no_icon';
			}
			return {
				imgId: imgId,
			};
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.service_icon {
		vertical-align: middle;
		padding: 5px 20px 5px 5px;
		height: 48px;
		width: 50px;
	}
</style>
