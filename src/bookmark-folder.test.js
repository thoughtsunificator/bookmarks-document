import ava from "ava"
import mock  from "@thoughtsunificator/mock"
import { BookmarksDocument, BookmarkFolder, Bookmark, BookmarkLink } from "../index.js"

ava("Add a child", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A")
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B")
	mock(b, "remove")
	bookmarkFolder.appendChild(b)
	bookmarkFolder.appendChild(b)
	test.is(b.remove.mock.callCount, 1)
	test.deepEqual(bookmarkFolder.children.map(item => item.title), ["A", "B"])
})

ava("Remove a child", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A")
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B")
	bookmarkFolder.appendChild(b)
	bookmarkFolder.removeChild(a)
	test.is(bookmarkFolder.children.length, 1)
	bookmarkFolder.removeChild(b)
	test.is(bookmarkFolder.children.length, 0)
})

ava("Test if a child exists", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A")
	a.ownerDocument = bookmarksDocument
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B")
	b.ownerDocument = bookmarksDocument
	bookmarkFolder.appendChild(b)
	test.true(bookmarkFolder.contains(a))
	test.true(bookmarkFolder.contains(b))
	test.false(a.contains(b))
	test.false(b.contains(a))
})

ava("Add a child before another one", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A")
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B")
	bookmarkFolder.appendChild(b)
	test.deepEqual(bookmarkFolder.children.map(item => item.title), ["A", "B"])
	const c = new BookmarkFolder("C")
	bookmarkFolder.insertBefore(c, b)
	test.is(c.parent, bookmarkFolder)
	test.deepEqual(bookmarkFolder.children.map(item => item.title), ["A", "C", "B"])
	const d = new BookmarkFolder("D")
	mock(d, "remove")
	test.is(d.remove.mock.callCount, 0)
	bookmarkFolder.insertBefore(d, a)
	test.is(d.parent, bookmarkFolder)
	bookmarkFolder.insertBefore(d, a)
	test.is(d.remove.mock.callCount, 1)
	test.deepEqual(bookmarkFolder.children.map(item => item.title), ["D", "A", "C", "B"])
})


ava("Add a child after another one", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A")
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B")
	bookmarkFolder.appendChild(b)
	const c = new BookmarkFolder("C")
	bookmarkFolder.insertAfter(c, a)
	test.is(c.parent, bookmarkFolder)
	const d = new BookmarkFolder("D")
	mock(d, "remove")
	bookmarkFolder.insertAfter(d, a)
	test.is(d.parent, bookmarkFolder)
	bookmarkFolder.insertAfter(d, a)
	test.is(d.remove.mock.callCount, 1)
	test.deepEqual(bookmarkFolder.children.map(item => item.title), ["A", "D", "C", "B"])
})

ava("Serialize the bookmark folder to an object keeping only relevant properties", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root", new Date(), new Date())
	const bookmarksDocument = new BookmarksDocument()
	bookmarkFolder.ownerDocument = bookmarksDocument
	const a = new BookmarkFolder("A", new Date(), new Date())
	a.attributes.foo = "bar"
	bookmarkFolder.appendChild(a)
	const b = new BookmarkFolder("B", new Date(), new Date())
	bookmarkFolder.appendChild(b)
	const c = new BookmarkFolder("C", new Date(), new Date())
	a.appendChild(c)
	test.deepEqual(bookmarkFolder.serialize(), {
		type: "folder",
		title: "Root",
		createdAt: bookmarkFolder.createdAt.toISOString(),
		updatedAt: bookmarkFolder.updatedAt.toISOString(),
		attributes: {},
		children: [
			{
				type: "folder",
				title: "A",
				createdAt: a.createdAt.toISOString(),
				updatedAt: a.updatedAt.toISOString(),
				attributes: { foo: "bar" },
				children: [
					{
						type: "folder",
						title: "C",
						createdAt: c.createdAt.toISOString(),
						updatedAt: c.updatedAt.toISOString(),
						attributes: {},
						children: []
					}
				]
			},
			{
				type: "folder",
				title: "B",
				createdAt: b.createdAt.toISOString(),
				updatedAt: b.updatedAt.toISOString(),
				attributes: {},
				children: []
			}
		]
	})
})

ava("Clone a bookmark folder", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root", new Date(), new Date())
	bookmarkFolder.ownerDocument = new BookmarksDocument()
	bookmarkFolder.appendChild(new BookmarkFolder("A", new Date(), new Date()))
	const clone = bookmarkFolder.clone()
	test.not(bookmarkFolder, clone)
	test.true(clone instanceof BookmarkFolder)
	test.is(clone.children.length, 0)
	test.is(clone.title, bookmarkFolder.title)
	test.true(clone.createdAt instanceof Date)
	test.is(clone.updatedAt, null)
	test.is(clone.ownerDocument, bookmarkFolder.ownerDocument)
	test.is(clone.type, Bookmark.FOLDER)
	test.is(clone.parent, null)
	test.is(clone.previousSibling, null)
	test.is(clone.nextSibling, null)
	test.is(clone.previousFolderSibling, null)
	test.is(clone.nextFolderSibling, null)
})

ava("Deep clone a bookmark folder", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root", new Date(), new Date())
	bookmarkFolder.ownerDocument = new BookmarksDocument()
	const a = new BookmarkFolder("A")
	a.ownerDocument = bookmarkFolder.ownerDocument
	const b = new BookmarkFolder("B")
	b.ownerDocument = bookmarkFolder.ownerDocument
	bookmarkFolder.appendChild(a)
	const a2 = new BookmarkLink("A2")
	a2.ownerDocument = bookmarkFolder.ownerDocument
	bookmarkFolder.appendChild(a2)
	a.appendChild(b)
	const b2 = new BookmarkFolder("B2")
	b2.ownerDocument = bookmarkFolder.ownerDocument
	a.appendChild(b2)
	b.appendChild(new BookmarkFolder("C"))
	const c2 = new BookmarkLink("C2")
	c2.ownerDocument = bookmarkFolder.ownerDocument
	b.appendChild(c2)
	const clone = bookmarkFolder.clone(true)
	test.is(clone.children[0].title, "A")
	test.is(clone.children[0].ownerDocument, bookmarkFolder.ownerDocument)
	test.is(clone.children[1].title, "A2")
	test.is(clone.children[0].children[0].title, "B")
	test.is(clone.children[0].children[0].ownerDocument, bookmarkFolder.ownerDocument)
	test.is(clone.children[0].children[1].title, "B2")
	test.is(clone.children[0].children[0].children[0].title, "C")
	test.is(clone.children[0].children[0].children[1].title, "C2")
	test.is(clone.children[0].children[0].children[1].ownerDocument, bookmarkFolder.ownerDocument)
})

ava("Retrieve the first child", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	bookmarkFolder.appendChild(new BookmarkFolder("A"))
	bookmarkFolder.appendChild(new BookmarkFolder("B"))
	test.is(bookmarkFolder.firstBookmark, bookmarkFolder.children[0])
	const bookmarkFolder2 = new BookmarkFolder("Root")
	bookmarkFolder2.appendChild(new BookmarkLink("A"))
	bookmarkFolder2.appendChild(new BookmarkFolder("B"))
	test.is(bookmarkFolder2.firstBookmark, bookmarkFolder2.children[0])
})

ava("Retrieve the first folder child", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	bookmarkFolder.appendChild(new BookmarkFolder("A"))
	bookmarkFolder.appendChild(new BookmarkFolder("B"))
	test.is(bookmarkFolder.firstBookmarkFolder, bookmarkFolder.children[0])
	const bookmarkFolder2 = new BookmarkFolder("Root")
	bookmarkFolder2.appendChild(new BookmarkLink("A"))
	bookmarkFolder2.appendChild(new BookmarkFolder("B"))
	test.is(bookmarkFolder2.firstBookmarkFolder, bookmarkFolder2.children[1])
})

ava("Retrieve the last child", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	bookmarkFolder.appendChild(new BookmarkFolder("A"))
	bookmarkFolder.appendChild(new BookmarkFolder("B"))
	test.is(bookmarkFolder.lastBookmark, bookmarkFolder.children[1])
	const bookmarkFolder2 = new BookmarkFolder("Root")
	bookmarkFolder2.appendChild(new BookmarkFolder("B"))
	bookmarkFolder2.appendChild(new BookmarkLink("A"))
	test.is(bookmarkFolder2.lastBookmark, bookmarkFolder2.children[1])
})

ava("Retrieve the last folder child", (test) => {
	const bookmarkFolder = new BookmarkFolder("Root")
	bookmarkFolder.appendChild(new BookmarkFolder("A"))
	bookmarkFolder.appendChild(new BookmarkFolder("B"))
	test.is(bookmarkFolder.lastBookmarkFolder, bookmarkFolder.children[1])
	const bookmarkFolder2 = new BookmarkFolder("Root")
	bookmarkFolder2.appendChild(new BookmarkFolder("B"))
	bookmarkFolder2.appendChild(new BookmarkLink("A"))
	test.is(bookmarkFolder2.lastBookmarkFolder, bookmarkFolder2.children[0])
})
