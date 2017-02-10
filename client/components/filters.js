import moment from 'moment';

export default {
	filters: {
		formatDate(date, format) {
			return moment.unix(date).format(format);
		},
		concatEnvironments(environments) {
			const environment_names = [];
			for(const environment_id in environments) {
				if (environments.hasOwnProperty(environment_id)) {
					environment_names.push(environments[environment_id].name);
				}
			}
			if(environment_names.length === 0) {
				return '';
			}
			return `(${environment_names.join(', ')})`;
		},
	},
};