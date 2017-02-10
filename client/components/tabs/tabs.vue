<template>
	<div class="tabs">
		<st-tab-list>
			<li v-for="(tab, index) in tabPanes"
				role="tab"
				:class="{selected: isActived(index)}"
				:selected="isActived(index)"
				@click="select(index)">{{tab.label}}</li>
		</st-tab-list>
		<div class="tab_panel">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	import stTabList from './tablist';

	export default {
		name: 'st-tabs',
		components: {
			stTabList,
		},
		data() {
			return {
				realSelectedIndex: this.selectedIndex,
				tabPanes: [],
			};
		},
		props: {
			selectedIndex: {
				type: Number,
				default: -1,
			},
		},
		mounted() {
			this.update();
			if (this.realSelectedIndex === -1) {
				this.select(0);
			}
		},
		methods: {
			update() {
				for (const tabPane of this.tabPanes) {
					if (tabPane.realSelected) {
						this.select(tabPane.index);
						break;
					}
				}
			},
			isActived(index) {
				return index === this.realSelectedIndex;
			},
			select(index) {
				this.realSelectedIndex = index;
			},
		},
		watch: {
			selectedIndex(newIndex) {
				this.select(newIndex);
			},
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.tabs div.tab_panel .solution_box:first-of-type {
		border-top: 0;
	}

	.tabs > ul {
		border-bottom: 1px solid #f3f4f5;
		text-align: right;
		padding-bottom: 7px;
	}

	.tabs > ul > li {
		color: #000000;
		display: inline;
		list-style-type: none;
		margin-right: 20px;
		cursor: pointer;
		padding-bottom: 6px;
		opacity: 0.6;
	}

	.tabs > ul > li.selected {
		border-bottom: 2px solid #698eca;
		opacity: 1;
	}
</style>
