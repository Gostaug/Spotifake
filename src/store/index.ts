import Vue from 'vue';
import Vuex from 'vuex';
import axiosInstance from '@/utils/axiosInstance';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    search({ commit }, payload: { search: string }) {
      return axiosInstance.get('/search', {
        params: {
          query: payload.search,
          type: 'artist',
        },
      })
        .then(res => res.data);
    },
    getAlbumsByArtistId({ commit }, payload: { artistId: string }) {
      return axiosInstance.get(`/artists/${payload.artistId}/albums`)
        .then(res => res.data);
    },
    getAlbumById({ commit }, payload: { albumId: string }) {
      return axiosInstance.get(`/albums/${payload.albumId}`)
        .then(res => res.data);
    },
  },
  modules: {
  },
});
