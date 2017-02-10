<template>
	<div>
		<span ref="trigger" @click="toggle">
			<slot name="trigger"></slot>
		</span>
		<div v-if="show">
			<div class="container" @click="toggle"></div>
			<div class="content">
				<button v-if="close" class="close" @click="toggle"><span>x</span></button>
				<div class="content-body">
					<slot name="content"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'st-modal',
		props: {
			close: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				show: false,
			};
		},
		methods: {
			toggle() {
				this.show = !this.show;
			},
		},
	};
</script>

<style scoped>
	.close {
		margin: -2px 5px 5px 5px;
		-webkit-appearance: none;
		padding: 0;
		cursor: pointer;
		background: 0 0;
		border: 0;
		float: right;
		font-size: 21px;
		font-weight: 700;
		line-height: 1;
		color: #000;
		text-shadow: 0 1px 0 #fff;
		filter: alpha(opacity=20);
		opacity: .2;
	}

	.container {
		background-color: rgba(0, 0, 0, .75);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
	}

	.content {
		position: absolute;
		height: auto;
		width: auto;
		max-width: 80vw;
		max-height: 80vh;
		color: #666;
		background: #fff;
		top: 50%;
		left: 50%;
		margin: auto;
		-ms-transform: translateX(-50%) translateY(-50%);
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		z-index: 100;
	}

	.content-body {
		padding: 36px;
	}

</style>
