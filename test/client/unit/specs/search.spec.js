import Vue from 'vue';
import stSearch from 'client/components/search';

describe('search.vue', () => {

	it('sets the correct default data', () => {
		expect(typeof stSearch.data).to.equal('function');
		const defaultData = stSearch.data();
		expect(defaultData.isActive).to.equal(false);
		expect(defaultData.searchSuggestions).to.be.empty;
	});

	it('should correctly search components', (done) => {
		const vm = new Vue({
			data: {
				searchItems: ['one', 'two', 'three', 'thirty'],
			},
			components: {
				stSearch,
			},
			template: '<st-search v-bind:search-items="searchItems"></st-search>'
		}).$mount().$children[0];

		vm.query = 'on';

		vm.$nextTick(() => {
			expect(vm.searchSuggestions).to.have.members(['one']);
			expect(vm.$el.querySelector('.search_suggestions .suggestion:nth-child(1)').textContent)
				.to.equal('one');

			vm.query = 'th';

			vm.$nextTick(() => {
				expect(vm.searchSuggestions).to.have.members(['three', 'thirty']);
				expect(vm.$el.querySelectorAll('.suggestion').length)
					.to.equal(2);
				done();
			});
		});
	});
});
