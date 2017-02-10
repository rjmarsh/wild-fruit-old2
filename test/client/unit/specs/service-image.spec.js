import Vue from 'vue';
import stServiceImg from 'client/components/service-image';

describe('service-image.vue', () => {
	it('sets the correct default data', () => {
		expect(typeof stServiceImg.data).to.equal('function');
	});
	it('should correctly render images', (done) => {
		const vm = new Vue({
			components: {
				stServiceImg,
			},
			template: '<st-service-img service-id="1172"></st-service-img>',
		}).$mount().$children[0];

		vm.$nextTick(() => {
			expect(vm.$el.querySelector('img')).to.not.equal.null;
			done();
		});
	});
});
