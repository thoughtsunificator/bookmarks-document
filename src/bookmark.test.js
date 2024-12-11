import mock  from "@thoughtsunificator/mock"
import ava from "ava"
import { Bookmark, BookmarksDocument } from "../index.js"

/**
 * @todo test
 */
ava("Tell whether all ascendants are unfolded", (test) => {
	const bookmark = new Bookmark("btitle", "btype", new Date(), new Date())
	bookmark.ownerDocument = new BookmarksDocument()
	bookmark.ascendantsUnfolded()
	test.pass()
})

/**
 * @todo test
 */
ava("Retrieve the node depth", (test) => {
	const bookmark = new Bookmark("btitle", "btype", new Date(), new Date())
	bookmark.ownerDocument = new BookmarksDocument()
	bookmark.getDepth()
	test.pass()
})

ava("Remove the bookmark", (test) => {
	const bookmark = new Bookmark("btitle", "btype", new Date(), new Date())
	const parent = { removeChild: () => {} }
	bookmark.parent = parent
	mock(parent, "removeChild")
	bookmark.remove()
	test.is(parent.removeChild.mock.callCount, 1)
})

ava("Retrieve the previous sibling", (test) => {
	const bookmark = new Bookmark("atitle", "atype", new Date(), new Date())
	const previousSibling = new Bookmark("btitle", "btype", new Date(), new Date())
	test.is(bookmark.previousSibling, null)
	mock(bookmark, "parent", () => ({ children: [previousSibling, bookmark] }))
	test.is(bookmark.previousSibling, previousSibling)
	mock(bookmark, "parent", () => ({ children: [bookmark, previousSibling] }))
	test.is(bookmark.previousSibling, null)
	mock(bookmark, "parent", () => ({ children: [bookmark] }))
	test.is(bookmark.previousSibling, null)
})

ava("Retrieve the next sibling", (test) => {
	const bookmark = new Bookmark("atitle", "atype", new Date(), new Date())
	const nextSibling = new Bookmark("btitle", "btype", new Date(), new Date())
	test.is(bookmark.nextSibling, null)
	mock(bookmark, "parent", () => ({ children: [bookmark, nextSibling] }))
	test.is(bookmark.nextSibling, nextSibling)
	mock(bookmark, "parent", () => ({ children: [nextSibling, bookmark] }))
	test.is(bookmark.nextSibling, null)
	mock(bookmark, "parent", () => ({ children: [bookmark] }))
	test.is(bookmark.nextSibling, null)
})

ava("Retrieve the previous folder sibling", (test) => {
	const bookmark = new Bookmark("atitle", "atype", new Date(), new Date())
	const bookmark2 = new Bookmark("atitle", "atype", new Date(), new Date())
	const previousFolderSibling = new Bookmark("btitle", Bookmark.FOLDER, new Date(), new Date())
	test.is(bookmark.previousFolderSibling, null)
	mock(bookmark, "parent", () => ({ children: [previousFolderSibling, bookmark2, bookmark] }))
	test.is(bookmark.previousFolderSibling, previousFolderSibling)
	mock(bookmark, "parent", () => ({ children: [bookmark2, bookmark, previousFolderSibling] }))
	test.is(bookmark.previousFolderSibling, null)
	mock(bookmark, "parent", () => ({ children: [bookmark2, bookmark] }))
	test.is(bookmark.previousFolderSibling, null)
})

ava("Retrieve the next folder sibling", (test) => {
	const bookmark = new Bookmark("atitle", "atype", new Date(), new Date())
	const bookmark2 = new Bookmark("atitle", "atype", new Date(), new Date())
	const nextFolderSibling = new Bookmark("btitle", Bookmark.FOLDER, new Date(), new Date())
	test.is(bookmark.nextFolderSibling, null)
	mock(bookmark, "parent", () => ({ children: [bookmark, bookmark2, nextFolderSibling] }))
	test.is(bookmark.nextFolderSibling, nextFolderSibling)
	mock(bookmark, "parent", () => ({ children: [nextFolderSibling, bookmark, bookmark2] }))
	test.is(bookmark.nextFolderSibling, null)
	mock(bookmark, "parent", () => ({ children: [bookmark, bookmark2] }))
	test.is(bookmark.nextFolderSibling, null)
})
