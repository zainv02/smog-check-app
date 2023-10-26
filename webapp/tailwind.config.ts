import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'light-60': 'oklab(1, 0, 0)',
                'light-30': 'oklab(0.400, 0.000, -0.083)',
                'light-10': 'oklab(0.900, 0.000, 0.167)'
            }
        },
        
    },
    plugins: [],
};

export default config;
