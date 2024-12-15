import ava from "ava"
import Bookmark from "./bookmark.js"
import { BookmarkLink, BookmarksDocument } from "../index.js"

ava("Clone a bookmark link", (test) => {
	const createdAt = new Date()
	const updatedAt = new Date()
	const bookmarkLink = new BookmarkLink("linktitle", "linkicon", "linkurl", createdAt, updatedAt)
	bookmarkLink.ownerDocument = new BookmarksDocument()
	const clone = bookmarkLink.clone()
	test.not(bookmarkLink, clone)
	test.true(clone instanceof BookmarkLink)
	test.is(clone.title, "linktitle")
	test.is(clone.icon, "linkicon")
	test.is(clone.url, "linkurl")
	test.is(clone.createdAt, createdAt)
	test.is(clone.updatedAt, updatedAt)
	test.is(clone.ownerDocument, bookmarkLink.ownerDocument)
	test.is(clone.type, Bookmark.LINK)
	test.is(clone.parent, null)
	test.is(clone.previousSibling, null)
	test.is(clone.nextSibling, null)
	test.is(clone.previousFolderSibling, null)
	test.is(clone.nextFolderSibling, null)
})

ava("Serialize the bookmark link to an object keeping only relevant properties", (test) => {
	const bookmarkLink = new BookmarkLink("linktitle", "linkicon", "linkurl", new Date(), new Date())
	bookmarkLink.attributes.bar = "foo"
	test.deepEqual(bookmarkLink.serialize(), {
		type: "link",
		title: "linktitle",
		icon: "linkicon",
		url: "linkurl",
		createdAt: bookmarkLink.createdAt.toISOString(),
		updatedAt: bookmarkLink.updatedAt.toISOString(),
		attributes: { bar: "foo" }
	})
})
