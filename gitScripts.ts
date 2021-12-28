const util = require('util');
const exec = require('child_process').exec;

const command = `git add . && git commit -m "update" && git push`;

const child = exec(
	command,
	function (error: string, stdout: string, stderr: string) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);

		if (error !== null) {
			console.log('exec error: ' + error);
		}
	},
);
console.log('yo');
