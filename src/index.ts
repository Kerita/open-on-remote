#!/usr/bin/env node

import cp = require('child_process');
import process = require('process');

const git = (args: string[]): cp.SpawnSyncReturns<string> =>
  cp.spawnSync('git', args);

export default function openOnRemote(): void {
  const commandForRemoteUrl = git(['config', '--get', 'remote.origin.url']);
  const remoteUrl = commandForRemoteUrl.stdout.toString().trim();

  if (!remoteUrl) {
    throw new Error('Could not find remote url');
  }

  const commandForCurrentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);

  const currentBranch = commandForCurrentBranch.stdout.toString().trim();

  if (!currentBranch) {
    throw new Error('Could not find current branch');
  }

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
  )}/tree/${currentBranch}`;

  // eslint-disable-next-line no-console
  console.log('Open on remote in default browser: \n', completedUrl);

  const start =
    process.platform == 'darwin'
      ? 'open'
      : process.platform == 'win32'
      ? 'start'
      : 'xdg-open';

  cp.exec(start + ' ' + completedUrl);
}

openOnRemote();
