<script>
	export default {
		name: 'st-service-status',
		props: {
			mode: {
				type: String,
				default: 'default',
			},
			serviceType: {
				type: String,
				default: '',
			},
			majorIssues: {
				type: Array,
				default () {
					return [];
				},
			},
			minorIssues: {
				type: Array,
				default () {
					return [];
				},
			},
			ongoingMaintenance: {
				type: Array,
				default () {
					return [];
				},
			},
			recentlyResolvedIssues: {
				type: Array,
				default () {
					return [];
				},
			},
		},
		render(createElement) {
			const ongoingIssues = this.majorIssues.length + this.minorIssues.length;
			const elems = [];
			if (this.serviceType !== 'cloud') {
				if (ongoingIssues) {
					elems.push({
						icon: this.majorIssues.length ? 'major_issue' : 'minor_issue',
						text: this.pluralize(ongoingIssues, 'ongoing issue'),
					});
				}
				if (this.recentlyResolvedIssues.length) {
					elems.push({
						icon: 'event',
						text: this.pluralize(this.recentlyResolvedIssues.length, 'recently resolved issue'),
					});
				}
				if (this.ongoingMaintenance.length) {
					elems.push({
						icon: 'maintenance',
						text: 'Undergoing maintenance',
					});
				}
			}

			if (!ongoingIssues && !this.recentlyResolvedIssues.length && !this.ongoingMaintenance.length) {
				elems.push({
					icon: 'normal',
					text: 'Functioning normally',
				});
			}
			const children = new Array(elems.length);
			for (let i = 0; i < elems.length; i++) {
				const elem = elems[i];
				const icon = createElement('img', {
					attrs: {
						src: `/static/img/icons/${elem.icon}.png`,
					},
				});

				// history mode is icon only
				if (this.mode === 'history') {
					children[i] = icon;
					continue;
				}
				children[i] = createElement('div', {
					attrs: {
						class: 'status',
					},
				}, [
					icon,
					createElement('span', {
						attrs: {
							class: 'status_text',
						},
						domProps: {
							innerHTML: elem.text,
						},
					}),
				]);
			}
			return createElement('div', {}, children);
		},
		methods: {
			pluralize(length, text) {
				let result = `${length} ${text}`;
				if (length > 1) {
					result += 's';
				}
				return result;
			},
		},
	};
</script>