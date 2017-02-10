<template>
	<div
		role="tabpanel"
		v-show="realSelected"
		:class="classObject"
		:aria-labelledby="label">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			selected: Boolean,
			label: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				realSelected: this.selected,
			};
		},
		created() {
			this.$parent.tabPanes.push(this);
		},
		beforeDestroy() {
			this.$parent.tabPanes.splice(this.index, 1);
		},
		computed: {
			classObject() {
				return {
					tab_panel: true,
				};
			},
			layout() {
				return this.$parent.layout;
			},
			index() {
				return this.$parent.tabPanes.indexOf(this);
			},
		},
		watch: {
			'$parent.realSelectedIndex': function watchIndex(index) {
				this.realSelected = this.index === index;
			},
		},
	};
</script>