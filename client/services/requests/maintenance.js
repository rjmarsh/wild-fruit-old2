/* eslint-disable */

import api from '../../services';

export default {
  get() {
    return api.get('/api/maintenance');
  },
};
