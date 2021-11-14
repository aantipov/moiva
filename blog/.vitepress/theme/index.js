import DefaultTheme from 'vitepress/theme';
import './custom.css';
import Layout from './Layout.vue';
import Footer from './Footer.vue';
import BlogItem from './BlogItem.vue';
import Header from './Header/Header.vue';
import Figure from './Figure.vue';

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that injects the slots
  Layout,
  enhanceApp({ app }) {
    app
      .component('Footer', Footer)
      .component('Header', Header)
      .component('Figure', Figure)
      .component('BlogItem', BlogItem);
  },
};
