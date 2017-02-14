import Vue from 'vue';
import wfTabs from 'client/components/tabs/tabs';
import stTabPane from 'client/components/tabs/tabpane';

describe('tabs.vue', () => {
	it('sets the correct default data', () => {
		expect(typeof wfTabs.data).to.equal('function');
		const defaultData = wfTabs.data();
		expect(defaultData.realSelectedIndex).to.be.undefined;
		expect(defaultData.tabPanes).to.be.empty;
	});

	it('should render with correct values', () => {
		const vm = new Vue({
			components: {
				wfTabs,
			},
			template: `<wf-tabs></wf-tabs>`
		}).$mount().$children[0];
		expect(vm.realSelectedIndex).to.be.equal(0);
		expect(vm.tabPanes).to.be.empty;
	});

	it('should correctly render configured panes', (done) => {
		const vm = new Vue({
			components: {
				wfTabs,
				stTabPane,
			},
			template: `
			<wf-tabs>
				<st-tab-pane label="tab1">tab1 content</st-tab-pane>
				<st-tab-pane label="tab2" selected>tab2 content</st-tab-pane>
				<st-tab-pane label="tab3">tab 3 content</st-tab-pane>
			</wf-tabs>
		  `,
		}).$mount().$children[0];

		expect(vm.realSelectedIndex).to.be.equal(1); // 2nd tab pane should be selected
		expect(vm.tabPanes.length).to.be.equal(3);

		vm.$nextTick(() => {
			expect(vm.$el.querySelector('.selected').textContent).to.be.equal('tab2');
			expect(vm.$el.querySelector('.tab_panel').textContent.trim()).to.be.equal('tab2 content');
			vm.$el.querySelector('.tab-list li:nth-child(1)').click();
			vm.$nextTick(() => {
				expect(vm.realSelectedIndex).to.be.equal(0);
				expect(vm.$el.querySelector('.selected').textContent).to.be.equal('tab1');
				expect(vm.$el.querySelector('.tab_panel').textContent.trim()).to.be.equal('tab1 content');
				done();
			});
		});
	});
});
