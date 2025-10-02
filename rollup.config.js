const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts').default;

const packageJson = require('./package.json');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false
      }),
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto'
      }),
      typescript({
        tsconfig: './tsconfig.build.json',
      }),
    ],
    external: (id) => {
      // Only externalize peer dependencies (React and React DOM)
      if (['react', 'react-dom'].includes(id)) {
        return true;
      }
      
      // React submodules
      if (id.startsWith('react/')) {
        return true;
      }
      
      return false;
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({
      tsconfig: './tsconfig.build.json'
    })],
    external: [/\.css$/],
  },
];
