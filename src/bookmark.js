/**
 * @module bookmark
 *
 * @typedef {import("./bookmarks-document.js").default} BookmarksDocument
 * @typedef {import("./bookmark-folder.js").default}   BookmarkFolder
 */

/**
 * Super class for both bookmark folders and links
 * @example
 * import { Bookmark } from "@thoughtsunificator/bookmarks-document"
 */
class Bookmark {

	/**
	 * @static
	 * @readonly
	 * @type {Symbol}
	 */
	static FOLDER = Symbol()

	/**
	 * @static
	 * @readonly
	 * @type {Symbol}
	 */
	static LINK = Symbol()

	/**
	 * @param {string} title
	 * @param {Symbol} type
	 * @param {Date}   createdAt   - Valid ISO 8601 date string
	 * @param {Date}   [updatedAt] - Valid ISO 8601 date string
	 */
	constructor(title, type, createdAt, updatedAt) {
		this._title = title
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		/** @type {BookmarksDocument} */
		this.ownerDocument = null
		/** @type {Symbol} */
		this.type = type
		/** @type {BookmarkFolder} */
		this.parent = null
		/**
		 * All attributes must be valid keys and values according to JSON.stringify.
		 * @type {object}
		 * **/
		this.attributes = {}
	}

	get title() {
		return this._title
	}

	/**
	 * @type {Bookmark}
	 */
	get previousSibling() {
		if(this.parent) {
			return this.parent.children[this.parent.children.indexOf(this) - 1] || null
		}
		return null
	}

	/**
	 * @type {Bookmark}
	 */
	get nextSibling() {
		if(this.parent) {
			return this.parent.children[this.parent.children.indexOf(this) + 1] || null
		}
		return null
	}

	/**
	 * @type {BookmarksDocument}
	 */
	get previousFolderSibling() {
		if(this.parent) {
			return this.parent.children.slice(0, this.parent.children.indexOf(this)).reverse().find((bookmark) => bookmark.type === Bookmark.FOLDER)  || null
		}
		return null
	}

	/**
	 * @type {BookmarksDocument}
	 */
	get nextFolderSibling() {
		if(this.parent) {
			return this.parent.children.slice(this.parent.children.indexOf(this) + 1).find((bookmark) => bookmark.type === Bookmark.FOLDER)  || null
		}
		return null
	}

	/**
	 * @type {string}
	 */
	get path() {
		throw new Error("Not implemented")
	}

	/**
	 * Return a list of properties that can then be serialized into a string
	 * @abstract
	 * @returns {object}
	 */
	serialize() {
		throw new Error("Not implemented")
	}

	/**
	 * Returns a duplicate of the current Bookmark.
	 * @abstract
	 * @returns {Bookmark}
	 */
	clone() {
		throw new Error("Not implemented")
	}

	/**
	 * @param {string} newTitle
	 */
	rename(newTitle) {
		if(this.parent) {
			const titles = this.parent.children.map(child => child.title)
			if(titles.includes(newTitle)) {
				throw new Error(`A bookmark with the title '${newTitle}' already exists`)
			}
		}
		this._title = newTitle
	}

	/**
	 * Whether all ascendants are unfolded
	 * @returns {boolean}
	 * @todo move out
	 */
	ascendantsUnfolded() {
		const treeWalker = this.ownerDocument.createTreeWalker(this)
		while (treeWalker.parentBookmark()) {
			if(!treeWalker.currentBookmark.unfolded) {
				return false
			}
		}
		return true
	}

	/**
	 * How deep the bookmark is in the hierarchy
	 * @returns {Number}
	 * @todo move out
	 */
	getDepth() {
		let depth = 0
		const treeWalker = this.ownerDocument.createTreeWalker(this)
		while (treeWalker.parentBookmark()) {
			depth++
		}
		return depth
	}

	/**
	 * Remove from the document
	 */
	remove() {
		this.parent.removeChild(this)
	}

}

export default Bookmark
