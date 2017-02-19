import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import Main from './views/main';
import Create from './views/create';
import Manage from './views/manage';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		component: App,
		children: [
			{
				path: '/',
				component: Main,
			},
			{
				path: '/create-workload',
				component: Create,
			},
			{
				path: '/manage-workloads',
				component: Manage,
			},
		],
	},
];

const router = new VueRouter({
	mode: 'history',
	routes,
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	data() {
		return {};
	},
});
