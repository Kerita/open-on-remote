import cp = require('child_process');

const git = (args: string[]): cp.SpawnSyncReturns<string> =>
  cp.spawnSync('git', args);

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
