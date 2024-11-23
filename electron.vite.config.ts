import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import VueTypeImports from 'vite-plugin-vue-type-imports';
import esbuild from 'rollup-plugin-esbuild';
import vueJsx from '@vitejs/plugin-vue-jsx';
export default defineConfig({
  main: {
    // child会报错
    plugins: [externalizeDepsPlugin(), bytecodePlugin({ chunkAlias: ['index'] })],
    build: {
      minify: true,
      target: 'node12.4',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
          child: resolve(__dirname, 'src/main/child/index.ts')
        },
        output: {
          format: 'cjs',
        }
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@api': resolve('src/api')
      }
    }
  },
  preload: {
    build: {
      minify: true,
      target: 'node12.4'
    },
    resolve: {
      alias: {
        '@preload': resolve('src/preload'),
        '@api': resolve('src/api'),
        '@resources': resolve('resources/')
      }
    },
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    build: {
      minify: true,
      cssMinify: true
    },
    css: {},
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@api': resolve('src/api'),
        '@resources': resolve('resources/')
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      VueTypeImports()
    ]
  }
});
