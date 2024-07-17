import { PluginCreator } from 'postcss';

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config: {
  plugins: PluginCreator<string | any>[];
} = {
  plugins: [
    tailwindcss,
    autoprefixer
  ]
};

export default config;