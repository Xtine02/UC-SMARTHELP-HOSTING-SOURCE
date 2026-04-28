#!/usr/bin/env node

import { build } from 'vite';
import { access } from 'fs/promises';
import { join } from 'path';

console.log('Starting build process...');

try {
  await build({
    configFile: './vite.config.ts',
    mode: 'production'
  });
  
  // Verify dist directory was created
  try {
    await access(join(process.cwd(), 'dist'));
    console.log('✅ Build successful - dist directory created');
  } catch (error) {
    console.error('❌ Build failed - dist directory not created');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
