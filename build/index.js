#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var git = function (args) {
    return cp.spawnSync('git', args);
};
var commandForRemoteUrl = git(['config', '--get', 'remote.origin.url']);
var remoteUrl = commandForRemoteUrl.stdout.toString().trim();
if (!remoteUrl) {
    throw new Error('Could not find remote url');
}
var commandForCurrentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
var currentBranch = commandForCurrentBranch.stdout.toString().trim();
if (!currentBranch) {
    throw new Error('Could not find current branch');
}
var remoteUrlRegExp = /^git@(.*).git$/;
var matchResult = remoteUrl.match(remoteUrlRegExp);
var repositoryUrl = (matchResult === null || matchResult === void 0 ? void 0 : matchResult.length) ? matchResult[1] : '';
if (!repositoryUrl) {
    throw new Error('Could not find repository url');
}
var completedUrl = "https://" + repositoryUrl.replace(':', '/') + "/tree/" + currentBranch;
// eslint-disable-next-line no-console
console.log('Open on remote in default browser: \n', completedUrl);
cp.spawn('open', [completedUrl]);
