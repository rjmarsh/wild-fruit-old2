import Vue from 'vue';
import wfPopover from 'client/components/popover';

describe('popover.vue', () => {

	it('sets the correct default data', () => {
		expect(typeof wfPopover.data).to.equal('function');
		const defaultData = wfPopover.data();
		expect(defaultData.show).to.equal(false);
		expect(defaultData.position).to.deep.equal({
			top: 0,
			left: 0,
		});
	});

	it('should correctly toggle when clicked', () => {
		const vm = new Vue({
			components: {
				wfPopover,
			},
			template: `
      <wf-popover placement="bottom">
        <button slot="trigger">click me</button>
        <div slot="content">
          <h1>Hello, World</h1>
        </div>
      </wf-popover>
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
