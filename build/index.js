#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cp = require("child_process");
var process = require("process");
var ARG_LIST = ['-b', '--branch', '-f', '--file'];
var git = function (args) {
    return cp.spawnSync('git', args);
};
var getArgMap = function () {
    var args = process.argv.slice(2);
    var argMap = {};
    for (var i = 0; i < args.length;) {
        if (ARG_LIST.includes(args[i]) && !ARG_LIST.includes(args[i + 1])) {
            argMap[args[i]] = args[i + 1];
            i += 2;
        }
        else {
            i++;
        }
    }
    return argMap;
};
function openOnRemote() {
    var commandForRemoteUrl = git(['config', '--get', 'remote.origin.url']);
    var remoteUrl = commandForRemoteUrl.stdout.toString().trim();
    if (!remoteUrl) {
        throw new Error('Could not find remote url');
    }
    var argMap = getArgMap();
    var commandForCurrentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
    var currentBranch = argMap['-b'] ||
        argMap['--branch'] ||
        commandForCurrentBranch.stdout.toString().trim();
    if (!currentBranch) {
        throw new Error('Could not find current branch');
    }
    var currentFile = argMap['-f'] || argMap['--file'] || '';
    // support SSH mode and HTTP mode
    var remoteUrlRegExp = /^(git@|https:\/\/)(.*).git$/;
    var matchResult = remoteUrl.match(remoteUrlRegExp);
    var repositoryUrl = (matchResult === null || matchResult === void 0 ? void 0 : matchResult.length) ? matchResult[2] : '';
    if (!repositoryUrl) {
        throw new Error('Could not find repository url');
    }
    var completedUrl = "https://" + repositoryUrl.replace(':', '/') + "/tree/" + currentBranch + "/" + currentFile;
    // eslint-disable-next-line no-console
    console.log('Open on remote in default browser: \n', completedUrl);
    var start = process.platform == 'darwin'
        ? 'open'
        : process.platform == 'win32'
            ? 'start'
            : 'xdg-open';
    if (process.env.NODE_ENV !== 'development') {
        cp.exec(start + ' ' + completedUrl);
    }
}
exports.default = openOnRemote;
openOnRemote();
