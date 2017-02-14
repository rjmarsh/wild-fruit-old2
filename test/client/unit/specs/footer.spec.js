import Vue from 'vue';
import wfFooter from 'client/components/footer';

describe('footer.vue', () => {
	it('sets the correct default data', () => {
		expect(typeof wfFooter.data).to.equal('function');
	});
	it('should render correct contents', () => {
		const vm = new Vue({
			el: document.createElement('div'),
			render: (f) => f(wfFooter),
		});
		expect(vm.$el.querySelector('.choose_language').getAttribute('data-localize-key'))
			.to.equal('footer_change_language');
	});
});
