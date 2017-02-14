import Vue from 'vue';
import ftModal from 'client/components/modal';

describe('modal.vue', () => {

	it('sets the correct default data', () => {
		expect(typeof ftModal.data).to.equal('function');
		const defaultData = ftModal.data();
		expect(defaultData.show).to.equal(false);
	});

	it('should correctly toggle when clicked', () => {
		const vm = new Vue({
			components: {
				ftModal,
			},
			template: `
      <wf-modal>
        <button slot="trigger">click me</button>
        <div slot="content">
          <h1>Hello, World</h1>
        </div>
      </wf-modal>
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
