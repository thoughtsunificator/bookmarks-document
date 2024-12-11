# Developer manual

This manual is aimed at developers and attempts to describe the technical parts of the software.

## Technologies

The package is exported through a single file called `index.js` which is located at the root.

### Static analysis

- [eslint](https://github.com/eslint/eslint) (analysis for `.js` files)
- [Knip](https://github.com/webpro-nl/knip) (general analysis for unused files, dependencies and more)

### Testing

- [avajs](https://github.com/avajs/ava) (unit testing)

## Guidelines

This guide lists, non-exhaustively, a few guidelines to follow when contributing to the code base.

As the guidelines are enforced by tools such as [eslint](https://github.com/eslint/eslint) for the most part you can easily verify that your work is compliant (in terms of style) using `npm run lint`.

### Code style

- code shall be written in English
- UTF-8 for the file encoding
- LF for the end of line sequence
- indentation is 2 tabs (except when its not and `.editorconfig` will make sure to police your IDE about that)
- maximum text width is 200 characters
- no space to indent, no trailing spaces
- no trailing semi-colon unless necessary
- code shall be documented using english and [jsdoc](https://github.com/jsdoc/jsdoc) (version 4)
- code shall be tested using [avajs](https://github.com/avajs/ava)
- no copyring shall be present in the source files a the sole exception of the LICENSE file
- tool configuration file begins with `.` and are placed at the root of the project
- modules import order is as follow: third-party modules, observables, models
- ecmascript classes or function declaration (no expression function style)

## Folder structure

In addition to the dot files which contain the tooling configurations the application is several folders:

```
├── dist - build artifacts
├── documentation - user and developer guides
├── src - source files
```

## Roadmap

A simplified version of the roadmap is available in the [TODO.md](../TODO.md) file. Otherwise, checkout the [enhancement issues](https://github.com/thoughtsunificator/bookmarks-document/labels/enhancement).
