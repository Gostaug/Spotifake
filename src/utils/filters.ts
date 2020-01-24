import Vue from 'vue';
import prettyMilliseconds from 'pretty-ms';

Vue.filter('formatDuration', (value: number) => prettyMilliseconds(value, { secondsDecimalDigits: 0 }));
