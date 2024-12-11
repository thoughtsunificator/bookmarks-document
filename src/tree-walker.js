/**
 * @module tree-walker
 * @typedef {import("./bookmark-folder.js").default} BookmarkFolder
 */

import Bookmark from "./bookmark.js"

/**
 * @example
 * import { BookmarksDocument } from "@thoughtsunificator/bookmarks-document"
 *
 * const bookmarksDocument = new BookmarksDocument()
 *
 * const treeWalker = bookmarksDocument.createTreeWalker(element)
 * const bookmarksList = []
 * while (treeWalker.nextBookmark()) {
 * 	bookmarksList.push(treeWalker.currentBookmark)
 * }
 */
class TreeWalker {

	/**
	 * @param {BookmarkFolder} rootBookmark
	 */
	constructor(rootBookmark) {
		this.currentBookmark = rootBookmark
		this._rootBookmark = rootBookmark
		this._path = []
	}

	/**
	 * @returns {BookmarkFolder}
	 */
	parentBookmark() {
		this.currentBookmark = this.currentBookmark.parent
		return this.currentBookmark
	}

	/**
	 * @returns {Bookmark}
	 */
	nextBookmark() {
		if(this.currentBookmark.type === Bookmark.FOLDER && this.currentBookmark.children.length >= 1) {
			const previousBookmark = this.currentBookmark
			this.currentBookmark = this.currentBookmark.children[0]
			if(previousBookmark !== this._rootBookmark) {
				this._path.push(previousBookmark)
			}
		} else if(this.currentBookmark.nextSibling !== null  &&
			(this._rootBookmark === this.currentBookmark.parent || this._path.includes(this.currentBookmark.parent))
			&& !this._path.includes(this.currentBookmark.nextSibling)) {
			this._path.push(this.currentBookmark.nextSibling)
			this.currentBookmark = this.currentBookmark.nextSibling
		} else {
			this.currentBookmark = null
			const parents = this._path.slice()
			parents.reverse()
			for(const bookmark of parents) {
				if(bookmark.nextSibling !== null && !this._path.includes(bookmark.nextSibling)) {
					this.currentBookmark = bookmark.nextSibling
					this._path.push(bookmark.nextSibling)
					break
				}
			}
		}
		return this.currentBookmark
	}
}

export default TreeWalker
