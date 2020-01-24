import request from 'request';
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@/utils/filters';
import axiosInstance from '@/utils/axiosInstance';

Vue.config.productionTip = false;

const clientId = process.env.VUE_APP_CLIENT_ID;
const clientSecret = process.env.VUE_APP_CLIENT_SECRET;

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization: `Basic ${(Buffer.from(`${clientId}:${clientSecret}`).toString('base64'))}`,
  },
  form: {
    grant_type: 'client_credentials',
  },
  json: true,
};

request.post(authOptions, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    axiosInstance.defaults.headers.authorization = `Bearer ${body.access_token}`;
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
