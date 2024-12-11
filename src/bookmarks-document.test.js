import ava from "ava"
import { BookmarksDocument, BookmarkFolder, BookmarkLink, VirtualBookmarkFolder, TreeWalker } from "../index.js"

ava("Create a link", (test) => {
	const bookmarksDocument = new BookmarksDocument()
	const bookmarkLink = bookmarksDocument.createLink()
	test.true(bookmarkLink instanceof BookmarkLink)
	test.is(bookmarkLink.ownerDocument, bookmarksDocument)
})

ava("Create a folder", (test) => {
	const bookmarksDocument = new BookmarksDocument()
	const bookmarkFolder = bookmarksDocument.createFolder()
	test.true(bookmarkFolder instanceof BookmarkFolder)
	test.is(bookmarkFolder.ownerDocument, bookmarksDocument)
})

ava("Create a virtual folder", (test) => {
	const bookmarksDocument = new BookmarksDocument()
	const bookmarkFolder = bookmarksDocument.createVirtualFolder()
	test.true(bookmarkFolder instanceof VirtualBookmarkFolder)
	test.is(bookmarkFolder.ownerDocument, bookmarksDocument)
})

ava("Create a tree walker", (test) => {
	const bookmarksDocument = new BookmarksDocument()
	test.true(bookmarksDocument.createTreeWalker() instanceof TreeWalker)
})

/**
 * @todo Test
 */
ava("Serialize the bookmark document to an object keeping only relevant properties", (test) => {
	// const bookmarksDocument = new BookmarksDocument()
	test.pass()
})

/**
 * @todo Test
 */
ava("Retrieve the total number of bookmarks", (test) => {
	// const bookmarksDocument = new BookmarksDocument()
	test.pass()
})
