// rollup-patch.js
// This file patches the Rollup native module loader to prevent it from trying to load native modules

const fs = require('fs');
const path = require('path');

// Path to the Rollup native.js file that's causing the issue
const nativeJsPath = path.resolve('./node_modules/rollup/dist/native.js');

// Check if the file exists
if (fs.existsSync(nativeJsPath)) {
  console.log('Patching Rollup native.js to avoid native module loading...');
  
  // Read the current content
  let content = fs.readFileSync(nativeJsPath, 'utf8');
  
  // Replace the problematic code with a version that always uses the JS implementation
  const patchedContent = content.replace(
    /function getBinaryName\(\) {[\s\S]*?return null;[\s\S]*?}/,
    'function getBinaryName() { return null; }'
  );
  
  // Write the patched file back
  fs.writeFileSync(nativeJsPath, patchedContent);
  console.log('Successfully patched Rollup to use JS implementation only');
} else {
  console.log('Rollup native.js file not found, skipping patch');
}
