#!/usr/bin/env node

import { build } from 'vite';

build({
  configFile: './vite.config.ts',
  mode: 'production'
}).catch(() => {
  process.exit(1);
});
