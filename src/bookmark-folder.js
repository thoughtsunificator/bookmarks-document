/**
 * @module bookmark-folder
 */
import Bookmark from "./bookmark.js"

/**
 * @description
 * A BookmarkFolder can hold references to link and folders
 * @example
 * import { BookmarkFolder } from "@thoughtsunificator/bookmarks-document"
 */
class BookmarkFolder extends Bookmark {

	/**
	 * @static
	 * @type {str}
	 */
	static DEFAULT_TITLE = "New Folder"

	/**
	 * @param {string}  title
	 * @param {Date}    createdAt   - Valid ISO 8601 date string
	 * @param {Date}    [updatedAt] - Valid ISO 8601 date string
	 * @param {boolean} root
	 */
	constructor(title, createdAt=null, updatedAt=null, root=false) {
		super(title, Bookmark.FOLDER, createdAt, updatedAt)
		/**
		 * Returns the children of this BookmarkFolder
		 * @type {Bookmark[]}
		 */
		this.children = []
		/**
		 * Whether the BookmarkFolder is the root BookmarkFolder of the BookmarksDocument
		 */
		this.root = root
		/**
		 * Whether the children are made visible
		 * Used to preserved the unfold state when moving a bookmark
		 */
		this.unfolded = false
	}

	/**
	 * Returns the children BookmarkFolder of this BookmarkFolder
	 * @type {BookmarkFolder[]}
	 */
	get childFolders() {
		return this.children.filter(child => child.type === Bookmark.FOLDER)
	}

	/**
	 * @type {Bookmark}
	 */
	get firstBookmark() {
		return this.children[0]
	}
	/**
	 * @type {BookmarkFolder}
	 */
	get firstBookmarkFolder() {
		return this.childFolders[0]
	}

	/**
	 * @type {Bookmark}
	 */
	get lastBookmark() {
		return this.children[this.children.length - 1]
	}

	/**
	 * @type {BookmarkFolder}
	 */
	get lastBookmarkFolder() {
		const childFolders = this.childFolders
		return childFolders[childFolders.length - 1]
	}

	/**
	 * @returns {BookmarkFolder}
	 * @param {boolean} deep
	 * @todo original property to access the original bookmark
	 */
	clone(deep) {
		const bookmarkFolder = new BookmarkFolder(this.title, new Date())
		bookmarkFolder.ownerDocument = this.ownerDocument
		if(deep) {
			for(const child of this.children) {
				bookmarkFolder.appendChild(child.clone(true))
			}
		}
		return bookmarkFolder
	}

	/**
	 * Add a child Bookmark to this BookmarkFolder
	 * @param  {Bookmark} bookmark
	 */
	appendChild(bookmark) {
		if(bookmark.parent !== null) {
			bookmark.remove()
		}
		this.children.push(bookmark)
		bookmark.parent = this
	}

	/**
	 * Remove a child Bookmark from this BookmarkFolder
	 * @param  {Bookmark} bookmark
	 */
	removeChild(bookmark) {
		this.children.splice(this.children.indexOf(bookmark), 1)
		bookmark.parent = null
	}

	/**
	 * Whether a Bookmark is contained in the BookmarkFolder
	 * @returns {boolean}
	 * @todo move out
	 */
	contains(bookmark) {
		const treeWalker = this.ownerDocument.createTreeWalker(this)
		while (treeWalker.nextBookmark()) {
			if(treeWalker.currentBookmark === bookmark) {
				return true
			}
		}
		return false
	}

	/**
	 *
	 * @param {Bookmark} newBookmark
	 * @param {Bookmark} referenceBookmark
	 */
	insertBefore(newBookmark, referenceBookmark) {
		if(newBookmark.parent !== null) {
			newBookmark.remove()
		}
		this.children.splice(this.children.indexOf(referenceBookmark), 0, newBookmark)
		newBookmark.parent = this
	}

	/**
	 *
	 * @param {Bookmark} newBookmark
	 * @param {Bookmark} referenceBookmark
	 */
	insertAfter(newBookmark, referenceBookmark) {
		if(newBookmark.parent !== null) {
			newBookmark.remove()
		}
		this.children.splice(this.children.indexOf(referenceBookmark) + 1, 0, newBookmark)
		newBookmark.parent = this
	}

	/**
	 * Return the serializable version of a BookmarkFolder (removing any unwanted properties)
	 * @returns {object}
	 */
	serialize() {
		return {
			type: "folder",
			title: this.title,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt?.toISOString() || null,
			attributes: this.attributes,
			children: this.children.map(child => child.serialize())
		}
	}

}

export default BookmarkFolder
