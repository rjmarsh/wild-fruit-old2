import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import Main from './views/main';

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
