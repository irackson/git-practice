const files = ['gitScripts.ts', 'playground.ts', 'test.ts'];

// const msg = ['autoSync changes:'].concat(files).join('\n');
// console.log(msg);

const newStuff = files.map((file) => `* ${file}`).join('\n');
