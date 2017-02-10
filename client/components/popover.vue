<template>
	<div>
		<span ref="trigger" @click="toggle">
			<slot name="trigger"></slot>
		</span>
		<div v-if="show">
			<div class="popup_overlay" @click="toggle"></div>
			<div ref="popover" v-if="show" class="popup_box">
				<div class="close_button"></div>
				<div class="popup_content">
					<slot name="content">{{content}}</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'st-popover',
		props: {
			content: {
				type: String,
			},
			placement: {
				type: String,
				default: 'bottom',
			},
		},
		data() {
			return {
				position: {
					top: 0,
					left: 0,
				},
				show: false,
			};
		},
		methods: {
			toggle() {
				this.show = !this.show;
				if (!this.show) {
					return;
				}
				setTimeout(() => {
					const popover = this.$refs.popover;
					const trigger = this.$refs.trigger.children[0];
					switch (this.placement) {
						case 'top':
							this.position.left = (trigger.offsetLeft - (popover.offsetWidth / 2))
								+ (trigger.offsetWidth / 2);
							this.position.top = trigger.offsetTop - popover.offsetHeight;
							break;
						case 'left':
							this.position.left = trigger.offsetLeft - popover.offsetWidth;
							this.position.top = (trigger.offsetTop + (trigger.offsetHeight / 2))
								- (popover.offsetHeight / 2);
							break;
						case 'right':
							this.position.left = trigger.offsetLeft + trigger.offsetWidth;
							this.position.top = (trigger.offsetTop + (trigger.offsetHeight / 2))
								- (popover.offsetHeight / 2);
							break;
						case 'bottom':
							this.position.left = (trigger.offsetLeft - (popover.offsetWidth / 2))
								+ (trigger.offsetWidth / 2);
							this.position.top = trigger.offsetTop + trigger.offsetHeight;
							break;
						default:
					}
					popover.style.top = `${this.position.top}px`;
					popover.style.left = `${this.position.left}px`;
				}, 0);
			},
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.popup_overlay {
		opacity: 0.0;
		background: #000;
		width: 100%;
		height: 100%;
		z-index: 99;
		top: 0;
		left: 0;
		position: fixed;
	}

	.popup_box {
		position: absolute;
		border: 1px solid #f3f4f5;
		box-shadow: 0 0 2px 1px rgba(35, 31, 32, .12);
		background-color: #ffffff;
		padding: 30px 15px;
		border-radius: 6px;
		min-width: 60px;
		max-width: 700px;
		z-index: 100;
	}

	.popup_box::before, .popup_box::after {
		content: "";
		position: absolute;
		bottom: 100%;
		left: 90%;
		border: solid transparent;
		transform-origin: 100% 100%;
		transform: rotate(-45deg);
	}

	.popup_box::before {
		margin-left: -8px;
		border-width: 8px;
		border-color: #f3f4f5 #f3f4f5 transparent transparent;
		box-shadow: 1px -1px 2px 0 rgba(35, 31, 32, .12);
	}

	.popup_box::after {
		margin-left: -7px;
		border-width: 7px;
		border-color: #ffffff #ffffff transparent transparent;
	}

	.popup_box.open_up::before, .popup_box.open_up::after {
		top: 100%;
		transform-origin: 0 0;
		transform: rotate(-45deg);
	}

	.popup_box.open_up::before {
		border-color: transparent transparent #f3f4f5 #f3f4f5;
		box-shadow: -1px 1px 2px 0 rgba(35, 31, 32, .12);
	}

	.popup_box.open_up::after {
		border-color: transparent transparent #ffffff #ffffff;
	}

	.popup_box .close_button {
		content: "";
		position: absolute;
		top: 2px;
		right: 2px;
		background: url('/static/img/close_black.png') top right no-repeat;
		padding: 9px;
		cursor: pointer;
		display: none;
	}

	.popup_header {
		text-align: center;
		font-size: 200%;
	}

	.popup_content {
		max-height: 400px;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
