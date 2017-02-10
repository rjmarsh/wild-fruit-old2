import Vue from 'vue';
import stPopover from 'client/components/popover';

describe('popover.vue', () => {

	it('sets the correct default data', () => {
		expect(typeof stPopover.data).to.equal('function');
		const defaultData = stPopover.data();
		expect(defaultData.show).to.equal(false);
		expect(defaultData.position).to.deep.equal({
			top: 0,
			left: 0,
		});
	});

	it('should correctly toggle when clicked', () => {
		const vm = new Vue({
			components: {
				stPopover,
			},
			template: `
      <st-popover placement="bottom">
        <button slot="trigger">click me</button>
        <div slot="content">
          <h1>Hello, World</h1>
        </div>
      </st-popover>
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
