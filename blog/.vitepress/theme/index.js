import DefaultTheme from 'vitepress/theme';
import './custom.css';
import Layout from './Layout.vue';
import Figure from './Figure.vue';
import Tweet from './Tweet.vue';

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that injects the slots
  Layout,
  enhanceApp({ app }) {
    app.component('Figure', Figure).component('Tweet', Tweet);
  },
};
