<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" width="100px"/>
    <v-container>
      <v-col cols="12">
        <v-row>
          <v-autocomplete
            placeholder="Chercher un artiste"
            :items="artists"
            :search-input.sync="search"
            elevation
            solo
            v-model="selectedArtist"
            :hide-no-data="!search"
            no-data-text="Aucun résultat"
            clearable
            rounded
            outlined
          >
          </v-autocomplete>
        </v-row>
      </v-col>
      <v-col v-if="selectedArtist">
        <v-row>
          <v-col
            :key="album.id"
            cols="12"
            v-for="album in albums"
          >
            <v-card>
              <v-card-title>
                <v-col cols="2">
                  <v-img :src="album.images[0].url" max-width="100px"></v-img>
                </v-col>
                <v-col cols="8">
                  <h3>{{album.name}}</h3>
                </v-col>
              </v-card-title>
              <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="text-left">Play</th>
                      <th class="text-left">Titre</th>
                      <th class="text-left" icon><v-icon>mdi-clock-outline</v-icon></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr :key="track.id" v-for="track in album.tracks.items">
                      <td class="text-left">
                        <v-btn
                          v-if="track.preview_url"
                          icon
                        >
                          <v-icon
                            @click="pauseAudio()"
                            dark
                            v-if="track.preview_url === currentTrack.preview_url && isPlaying"
                          >
                            mdi-pause-circle-outline
                          </v-icon>
                          <v-icon
                            @click="playAudio(track, album, selectedArtist)"
                            dark
                            v-else
                          >
                            mdi-play-circle-outline
                          </v-icon>
                        </v-btn>
                      </td>
                      <td class="text-left">{{ track.name }}</td>
                      <td class="text-left">{{ track.duration_ms | formatDuration}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else-if="recentSearches.length > 0">
        <v-row>
          <h1>Recherches récentes</h1>
          <v-col
            :key="artist.id"
            cols="12"
            class="py-1"
            v-for="artist in recentSearches"
          >
            <v-row>
              <v-btn
                @click="selectedArtist = artist"
                text
                x-large
              >
                {{artist.name}}
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-footer
        app
        padless
        v-show="!!currentTrack.preview_url"
      >
        <v-row
          no-gutters
          align="start"
          justify="start"
        >
          <v-col cols="5">
            <v-row>
              <v-col cols="2" class="pl-6">
                <v-img
                  :src="!!currentAlbum ? currentAlbum.images[0].url : 'logo'"
                  max-width="70px"
                ></v-img>
              </v-col>
              <v-col align="">
                <v-row v-if="currentTrack">
                  <h3>{{currentTrack.name}}</h3>
                </v-row>
                <v-row v-if="currentTrack">
                  <h5>{{currentArtist.name}}</h5>
                </v-row>
              </v-col>
              <v-col align-self="center">
                <audio
                  id="myPlayer"
                  controls
                  autoplay
                  @playing="isPlaying = true"
                  @pause="isPlaying = false"
                  :src="currentTrack.preview_url">
                </audio>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {},
  data() {
    return {
      artists: [],
      albums: [],
      selectedArtist: {},
      recentSearches: [],
      search: '',
      currentTrack: {},
      currentArtist: {},
      currentAlbum: null,
      isPlaying: false,
    };
  },
  mounted() {
    //
  },
  watch: {
    search(val) {
      if (val) {
        this.$store.dispatch('search', { search: this.search })
          .then((res) => {
            this.artists = res.artists.items.map(item => ({
              text: item.name,
              value: { ...item },
            }));
          });
      }
    },
    selectedArtist(val) {
      if (val) {
        if (!this.recentSearches.map(item => item.id).includes(val.id)) {
          this.recentSearches.push(val);
        }
        this.$store.dispatch('getAlbumsByArtistId', { artistId: val.id })
          .then(async (res) => {
            this.albums = await Promise.all(
              res.items.map(album => this.$store.dispatch('getAlbumById', { albumId: album.id })
                .then(item => item)),
            );
          });
      }
    },
  },
  computed: {
    //
  },
  methods: {
    playAudio(track, album, artist) {
      this.currentTrack = track;
      this.currentAlbum = album;
      this.currentArtist = artist;
      const audio = document.getElementById('myPlayer');
      audio.play();
    },
    pauseAudio() {
      const audio = document.getElementById('myPlayer');
      audio.pause();
    },
  },
};
</script>

<style>
  audio {
    position: fixed;
    bottom: 0;
  }
</style>
