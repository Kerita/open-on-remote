#!/usr/bin/env node
/* eslint-disable no-console */

import cp = require('child_process');
import process = require('process');

const ARG_LIST = ['-b', '--branch', '-f', '--file'];

const git = (args: string[]): cp.SpawnSyncReturns<string> =>
  cp.spawnSync('git', args);

const getArgMap = (): { [key: string]: string } => {
  const args = process.argv.slice(2);
  const argMap: { [key: string]: string } = {};
  for (let i = 0; i < args.length; ) {
    if (ARG_LIST.includes(args[i]) && !ARG_LIST.includes(args[i + 1])) {
      argMap[args[i]] = args[i + 1];
      i += 2;
    } else {
      i++;
    }
  }
  return argMap;
};

export default function openOnRemote(): void {
  const commandForRemoteUrl = git(['config', '--get', 'remote.origin.url']);
  const remoteUrl = commandForRemoteUrl.stdout.toString().trim();

  if (!remoteUrl) {
    console.error('Could not find remote url');
    return;
  }

  const argMap = getArgMap();

  const commandForCurrentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const currentBranch =
    argMap['-b'] ||
    argMap['--branch'] ||
    commandForCurrentBranch.stdout.toString().trim();
  if (!currentBranch) {
    console.error('Could not find current branch');
    return;
  }

  const currentFile = argMap['-f'] || argMap['--file'] || '';

  // support SSH mode and HTTP mode
  const remoteUrlRegExp = /^(git(lab|hub)?@|https:\/\/)(.*).git$/;
  const matchResult = remoteUrl.match(remoteUrlRegExp);
  const repositoryUrl = matchResult?.length ? matchResult[3] : '';

  if (!repositoryUrl) {
    console.error('Could not find repository url');
    return;
  }

  const completedUrl = `https://${repositoryUrl.replace(
    ':',
    '/',
  )}/tree/${currentBranch}/${currentFile}`;

  console.log('Open on remote in default browser: \n', completedUrl);

  const start =
    process.platform == 'darwin'
      ? 'open'
      : process.platform == 'win32'
      ? 'start'
      : 'xdg-open';

  if (process.env.NODE_ENV !== 'development') {
    cp.exec(start + ' ' + completedUrl);
  }
}

openOnRemote();
