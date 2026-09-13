import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        classes: resolve(root, 'classes.html'),
        news: resolve(root, 'news.html'),
        gallery: resolve(root, 'gallery.html'),
        policies: resolve(root, 'policies.html'),
        contact: resolve(root, 'contact.html'),
      },
    },
  },
});
