import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import Main from './views/main';
import Service from './views/service';

import requests from './services/requests';

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
				path: '/:service_id',
				component: Service,
				props: true,
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
		return {
			mainCallout: 'All Systems Functioning Normally',
			globalMessage: '',
			searchItems: [],
			services: [],
			allServices: {},
			loading: false,
			ongoingIssues: 0,
		};
	},
	created() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.loading = true;
			requests.getFormattedData().then(([services, searchItems, globalMessage, allServices, ongoingIssues]) => {
				this.globalMessage = globalMessage;
				this.services = services;
				this.searchItems = searchItems;
				this.allServices = allServices;
				this.loading = false;
				this.ongoingIssues = ongoingIssues;
			});
		},
	},
});
