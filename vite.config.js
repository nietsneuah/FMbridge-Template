
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Custom plugin to exclude sample data files
const excludeSampleDataPlugin = () => {
  return {
    name: 'exclude-sample-data',
    generateBundle(_, bundle) {
      Object.keys(bundle).forEach(fileName => {
        if (
          fileName.includes('sample-') ||
          fileName.includes('test-data') ||
          fileName.includes('mock-data') ||
          fileName.includes('dummy-data')
        ) {
          delete bundle[fileName];
          console.log(`Excluded sample data file from build: ${fileName}`);
        }
      });
    }
  };
};

export default defineConfig(({ command, mode }) => {
  const baseConfig = {
    base: './',
    plugins: [excludeSampleDataPlugin()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: 'bundle.js',
          chunkFileNames: 'bundle.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'styles.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
          manualChunks: () => 'bundle',
        },
      },
    },
    optimizeDeps: {
      include: ['apexcharts', 'tabulator-tables'],
    },
    server: {
      port: 3000,
      open: true,
    },
  };

  if (mode === 'filemaker') {
    return {
      ...baseConfig,
      plugins: [...baseConfig.plugins, viteSingleFile()],
      build: {
        ...baseConfig.build,
        outDir: 'dist/filemaker',
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        rollupOptions: {
          ...baseConfig.build.rollupOptions,
          inlineDynamicImports: true,
          output: {
            ...baseConfig.build.rollupOptions.output,
            manualChunks: undefined,
          },
        },
      },
      define: {
        'import.meta.env.MODE': JSON.stringify('filemaker'),
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    };
  }

  return baseConfig;
});
