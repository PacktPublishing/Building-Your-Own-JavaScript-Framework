const fs = require('fs');
const sources = {
 './node_modules/@angular/core': 'angular',
 './node_modules/vue/dist': 'vue',
 './node_modules/@sveltejs/adapter-node': 'svelte-adapter-node',
};

console.log('Extracting sources...');
Object.keys(sources).forEach(key => {
    fs.cpSync(key, sources[key], {recursive: true});
});

console.log('Done!');