# bookmarks-document

Bookmarks data structure inspired by the [DOM](https://dom.spec.whatwg.org/#interface-document).

## 😠 Motivations

- There are not that many bookmarks data structures out there even less with a straight-forward API

## ✨ Features

Simple, straight-forward and familiar API before anything.

* ✅ ESM and bloat-free
* ✅ Create, read, delete and update both bookmark links and folders
* ✅ Supports well known formats such as Netscape Bookmark File Format
* ✅ Can be serialized to a JSON representation

> While this is not strictly a feature, this software is [free](https://www.gnu.org/philosophy/free-sw.en.html).

> 💡 Missing a feature? Checkout the [TODO file](./TODO.md) to see what work is in progress.

## Usage

**Prerequisites**:

* Node.js >=18.0.0
* npm >=8.0.0

## 🚀 How to use

Please refer to the [user manual](./documentation/user-manual.md).

## 🔨 Development

> It is recommended to read the [developer manual](./documentation/developer-manual.md).

### 🧪 Testing

Lint:
- ``npm run test:lint``

Lint individually:

- <details>
  <summary>Spoiler</summary>

  Javascript files ([eslint](https://github.com/eslint/eslint)):
  - ``npm run test:lint:ecmascript``
  
</details>


Run test with [ava](https://github.com/avajs/ava):
- ``npm test``
> Use the ``NODE_DEBUG=bookmarks-document`` env to enable debug logs while testing.
> ``npm run test:watch`` is also available if you want to enable ava's [watch mode](https://github.com/avajs/ava/blob/main/docs/recipes/watch-mode.md). 

Coverage:
- ``npm run build:coverage``
> The coverage report files are available under **dist/coverage**

## 🧒 Contributions

Contributions [are more than welcome](./.github/CONTRIBUTING.md).

## 👾 Bug report 

❗Please search [the existing issues](https://github.com/thoughtsunificator/bookmarks-document/labels/bug) and make sure the bug has not already been reported before making a new one.

To report a bug please use [this link](https://github.com/thoughtsunificator/bookmarks-document/issues/new?assignees=&labels=&projects=&template=BUG_REPORT.md&title=).

## 💡 Feature request 

❗Make sure your suggestion is not already on the [TODO.md](TODO.md) and hasn't [already been requested](https://github.com/thoughtsunificator/bookmarks-document/labels/enhancement).

To suggest an idea please use [this link](https://github.com/thoughtsunificator/bookmarks-document/issues/new?assignees=&labels=&projects=&template=FEATURE_REQUEST.md&title=).

