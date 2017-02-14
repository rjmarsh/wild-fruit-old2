import Vue from 'vue';
import wfHeader from 'client/components/header';

describe('header.vue', () => {
	it('should render correct contents', () => {
		const vm = new Vue({
			el: document.createElement('div'),
			render: (f) => f(wfHeader),
		});
		expect(vm.$el.querySelector('.header a span').textContent)
			.to.equal('System Status');

		expect(vm.$el.querySelector('.header > a').getAttribute('href'))
			.to.equal('/');
	});
});
