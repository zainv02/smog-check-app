// import vike from 'vike/plugin';
import path from 'node:path';

import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import tsconfigPaths from 'vite-tsconfig-paths';
// import devtools from 'solid-devtools/vite';

const envPath = path.resolve(__dirname, '../.env');
console.log('ENV resolved path:', envPath);
dotenv.config({ path: envPath });

export default defineConfig({
    plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
        // devtools(),
        solidPlugin(),
        solidSvg(),
        tsconfigPaths(),
        // vike()
    ],
    server: {
        port: process.env.API_PORT as unknown as number || 3000,
    },
    build: {
        target: 'esnext',
    },
});
