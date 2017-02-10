import Vue from 'vue';
import stLegend from 'client/components/legend';

describe('legend.vue', () => {
	it('should render correct contents', () => {
		const vm = new Vue({
			el: document.createElement('div'),
			render: (f) => f(stLegend),
		});
		expect(vm.$el.querySelector('.legend div:nth-child(1) span').textContent)
			.to.equal('Normal');
	});
});
