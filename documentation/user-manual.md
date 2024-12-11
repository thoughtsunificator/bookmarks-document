# User manual

This manual is aimed at end users and attempts to describe the operational part of the software; how the library can be used. 

> ⚠️ This guide will not explain the motivations behind the as it is already covered in [README file](../README.md#️-motivations).

> A documentation is available https://bookmarks-document.unificator.me 

## Basics

Assuming `node >=18`.

Install the package:

`npm install @thoughtsunificator/bookmarks-document`

### Create a document

Bookmarks are organized in a single `BookmarksDocument`.

To create a `BookmarksDocument`:

```js
import { BookmarksDocument } from "@thoughtsunificator/bookmarks-document"
const bookmarksDocument = new BookmarksDocument()
```

It is worth nothing that all BookmarksDocument have a root element, `documentElement`:

```js
console.log(bookmarksDocument.documentElement)
```

The root element is a `BookmarkFolder` which default title is `Root`.

### Create a folder

Using the previously created `BookmarksDocument`:

```js
const bookmarkFolder = bookmarksDocument.createFolder("My folder")
```

### Create a link

```js
const bookmarkLink = bookmarksDocument.createLink("My link", null, "https://foo")
```

### Update a bookmark

```
bookmarkLink.title = "My new link title"
```

### Delete a bookmark

```js
bookmarkLink.remove()
```


