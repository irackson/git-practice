import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';

const options: Partial<SimpleGitOptions> = {
	baseDir: process.cwd(),
	binary: 'git',
	maxConcurrentProcesses: 6,
};
const git: SimpleGit = simpleGit(options);

export const gitAutomation = async () => {
	const searchResult = await (await git.grep('sync')).results;
	return searchResult;
};

const makeCommit = async (files: string[]) => {
	await git
		.add(files)
		.commit(
			['autoSync changes:'].concat(files).join('\n'),
			files,
			() => {},
		);
};
makeCommit(['gitScripts.ts', 'playground.ts']);
