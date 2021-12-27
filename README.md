# open-on-remote

Open git project on remote in default browser.

Support Git hosting services,test with GitHub and GitLab.

## usage

type `or` in git project folder, then open-on-remote will open the current project on remote in default browser.

`or` means open remote.

`-b` or `--branch` to set custom branch name.

```
or -b master
or --branch master
```

`-f` or `--file` to set specified file.

```
or -f README.md
or --file README.md
```

## TODO

- [x] support custom branch name
- [x] support specified file
- [ ] support dev env not open browser
- [ ] support auto build & publish
