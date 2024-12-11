import ava from "ava"
import { BookmarksDocument, TreeWalker, BookmarkFolder, BookmarkLink } from "../index.js"

ava("Traverse ascendants", (test) => {
	const bookmarkFolder = new BookmarkFolder("A")
	const bookmarkLink = new BookmarkLink("B")
	const bookmarkFolder3 = new BookmarkFolder("C")
	const bookmarkFolder4 = new BookmarkFolder("D")
	bookmarkFolder.appendChild(bookmarkLink)
	bookmarkFolder.appendChild(bookmarkFolder3)
	bookmarkFolder3.appendChild(bookmarkFolder4)
	const treeWalker = new TreeWalker(bookmarkFolder4)
	const bookmarksList = []
	while(treeWalker.parentBookmark()) {
		bookmarksList.push(treeWalker.currentBookmark)
	}
	test.is(bookmarksList.length, 2)
})

ava("Traverse decendants and siblings", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A")
	a.ownerDocument = bookmarksDocument
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B")
	b.ownerDocument = bookmarksDocument
	bookmarkFolder.appendChild(b)
	const treeWalker = new TreeWalker(bookmarkFolder)
	const bookmarksList = []
	while(treeWalker.nextBookmark()) {
		bookmarksList.push(treeWalker.currentBookmark)
	}
	test.is(bookmarksList.length, 2)
	test.deepEqual(bookmarksList, [a, b])
})
