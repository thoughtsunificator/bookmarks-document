/**
 * @module bookmark-document
 *
 * @typedef {import("./bookmark.js").default} Bookmark
 */
import BookmarkFolder from "./bookmark-folder.js"
import BookmarkLink from "./bookmark-link.js"
import TreeWalker from "./tree-walker.js"
import VirtualBookmarkFolder from "./virtual-bookmark-folder.js"

/**
 * Bookmarks are represented as a tree in a BookmarkDocument
 * @example
 * import { BookmarksDocument } from "@thoughtsunificator/bookmarks-document"
 */
class BookmarksDocument {

	/**
	 * @params {string} [title="Root"]
	 */
	constructor(title="Root") {
		/**
		 * The root BookmarkFolder
		 * @type {BookmarkFolder}
		 */
		this.documentElement = new BookmarkFolder(title, new Date(), new Date(), true)
		this.documentElement.ownerDocument = this
	}

	/**
	 * Create a bookmark link
	 * The ownerDocument property is automatically set
	 * @param   {string}        title
	 * @param   {string}        icon
	 * @param   {string}        url
	 * @param   {Date}          createdAt
	 * @param   {Date}          updatedAt
	 * @returns {BookmarkLink}
	 */
	createLink(title, icon, url, createdAt, updatedAt) {
		const bookmark = new BookmarkLink(title, icon, url, createdAt, updatedAt)
		bookmark.ownerDocument = this
		return bookmark
	}

	/**
	 * Create a bookmark folder
	 * The ownerDocument property is automatically set
	 * @param   {string}         title
	 * @param   {Date}           createdAt
	 * @param   {Date}           updatedAt
	 * @returns {BookmarkFolder}
	 */
	createFolder(title, createdAt, updatedAt) {
		const bookmark = new BookmarkFolder(title, createdAt, updatedAt)
		bookmark.ownerDocument = this
		return bookmark
	}

	/**
	 * Create a virtual bookmark folder
	 * @returns {VirtualBookmarkFolder}
	 */
	createVirtualFolder() {
		const bookmark = new VirtualBookmarkFolder()
		bookmark.ownerDocument = this
		return bookmark
	}

	/**
	 * @param   {BookmarkFolder}  bookmarkFolder
	 * @returns {TreeWalker}
	 */
	createTreeWalker(bookmarkFolder) {
		return new TreeWalker(bookmarkFolder)
	}

	/**
	 * Return a list of bookmark removing any unwanted properties in the process
	 * @returns {Bookmark[]}
	 */
	serialize() {
		return this.documentElement.children.map(child => child.serialize())
	}

	/**
	 * Returns the number of bookmarks present in this BookmarksDocument
	 * (excluding) the root folder
	 * @returns {number}
	 */
	getBookmarksCount() {
		const treeWalker = this.createTreeWalker(this.documentElement)
		let count = 0
		while (treeWalker.nextBookmark()) {
			count++
		}
		return count
	}

}

export default BookmarksDocument
