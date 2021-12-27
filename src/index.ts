#!/usr/bin/env node

import cp = require('child_process');
import process = require('process');

console.log(process.argv);

const git = (args: string[]): cp.SpawnSyncReturns<string> =>
  cp.spawnSync('git', args);

const getArgMap = (): { [key: string]: string } => {
  const args = process.argv.slice(2);
  const argMap: { [key: string]: string } = {};
  args.forEach((item: string) => {
    const [key, value] = item.split('=');
    if (key && value) {
      argMap[key] = value;
    }
  });
  return argMap;
};

export default function openOnRemote(): void {
  const commandForRemoteUrl = git(['config', '--get', 'remote.origin.url']);
  const remoteUrl = commandForRemoteUrl.stdout.toString().trim();

  if (!remoteUrl) {
    throw new Error('Could not find remote url');
  }

  const argMap = getArgMap();

  const commandForCurrentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const currentBranch =
    argMap['-b'] ||
    argMap['--branch'] ||
    commandForCurrentBranch.stdout.toString().trim();
  if (!currentBranch) {
    throw new Error('Could not find current branch');
  }

  const currentFile = argMap['-f'] || argMap['--file'] || '';

  // support SSH mode and HTTP mode
  const remoteUrlRegExp = /^(git@|https:\/\/)(.*).git$/;
  const matchResult = remoteUrl.match(remoteUrlRegExp);
  const repositoryUrl = matchResult?.length ? matchResult[2] : '';

  if (!repositoryUrl) {
    throw new Error('Could not find repository url');
  }

  const completedUrl = `https://${repositoryUrl.replace(
    ':',
    '/',
  )}/tree/${currentBranch}/${currentFile}`;

  // eslint-disable-next-line no-console
  console.log('Open on remote in default browser: \n', completedUrl);

  const start =
    process.platform == 'darwin'
      ? 'open'
      : process.platform == 'win32'
      ? 'start'
      : 'xdg-open';

  cp.exec(start + ' ' + completedUrl);

  if (process.env.NODE_ENV !== 'development') {
    cp.exec(start + ' ' + completedUrl);
  }
}

openOnRemote();
