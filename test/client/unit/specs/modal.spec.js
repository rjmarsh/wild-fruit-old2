import Vue from 'vue';
import stModal from 'client/components/modal';

describe('modal.vue', () => {

	it('sets the correct default data', () => {
		expect(typeof stModal.data).to.equal('function');
		const defaultData = stModal.data();
		expect(defaultData.show).to.equal(false);
	});

	it('should correctly toggle when clicked', () => {
		const vm = new Vue({
			components: {
				stModal,
			},
			template: `
      <st-modal>
        <button slot="trigger">click me</button>
        <div slot="content">
          <h1>Hello, World</h1>
        </div>
      </st-modal>
      `
		}).$mount().$children[0];

		const trigger = vm.$el.querySelector('button');
		expect(trigger.textContent).to.equal('click me');
		vm.toggle();

		vm.$nextTick(() => {
			expect(vm.$el.querySelector('h1').textContent).to.equal('Hello, World');
			vm.toggle();
			vm.$nextTick(() => {
				expect(vm.$el.querySelector('h1')).to.be.null;
			});
		});
	});
});
