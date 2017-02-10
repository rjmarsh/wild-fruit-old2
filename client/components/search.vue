<template>
	<div class="desktop_search">
		<div class="search">
			<div v-bind:class="{ search_bar_hover: isActive }" class="search_bar">
				<img src="/static/img/icons/search.png">
				<input type="search" v-model="query" @focus="isActive = true" @blur="isActive = false"
					   placeholder="Search for a service">
			</div>
			<div v-bind:class="{ show_suggestions: searchSuggestions.length > 0 }" class="search_suggestions">
				<div v-for="suggestion in searchSuggestions" class="suggestion">{{suggestion}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'st-search',
		props: ['searchItems'],
		data() {
			return {
				isActive: false,
				query: '',
				searchSuggestions: [],
			};
		},
		watch: {
			query() {
				this.searchSuggestions = [];
				const val = this.query;
				if (val.length > 0) {
					const valueRegex = new RegExp(val.trim(), 'i');
					for (let i = this.searchItems.length - 1; i >= 0; i -= 1) {
						const item = this.searchItems[i];
						if (item.match(valueRegex)) {
							this.searchSuggestions.push(item);
						}
					}
				}
			},
		},
	};
</script>

<style scoped>
	.suggestion {
		text-align: left;
		padding: 7px;
		cursor: pointer;
	}

	.suggestion:hover {
		background-color: #f3f4f5;
	}

	.search_bar.search_bar_hover {
		box-shadow: inset .1em .1em 0 0 #3595f5, inset -.0825em -.0825em 0 0 #3595f5;
	}

	.search_bar:hover:not(.search_bar_hover) {
		box-shadow: inset .1em .1em 0 0 #b5b5b5, inset -.0825em -.0825em 0 0 #b5b5b5;
	}

	.search_bar {
		background-color: #ffffff;
		box-shadow: inset .1em .1em 0 0 #d5d5d5, inset -.0825em -.0825em 0 0 #d5d5d5;
		border-radius: 4px;
		padding: 6px;
	}

	.search_bar img {
		vertical-align: middle;
	}

	.search_bar input {
		border: 0;
		box-shadow: none;
		outline: none;
		width: 230px;
	}

	.search {
		position: relative;
		display: inline-block;
		margin-top: 9px;
		white-space: nowrap;
	}

	.mobile_search {
		display: none;
	}

	.search_suggestions {
		display: none;
		position: absolute;
		background-color: #ffffff;
		z-index: 2;
		border: 1px solid #f3f4f5;
		max-height: 320px;
		width: 262px;
		overflow-y: auto;
	}

	.search_suggestions.show_suggestions {
		display: block;
	}
</style>
