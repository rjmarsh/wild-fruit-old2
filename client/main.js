import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import Main from './views/main';
import Create from './views/create';
import Manage from './views/manage';
import Learn from './views/learn';

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
				path: '/create-workflow',
				component: Create,
			},
			{
				path: '/manage-workflows',
				component: Manage,
			},
			{
				path: "/learn",
				component: Learn,
			}
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
