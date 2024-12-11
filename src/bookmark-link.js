/**
 * @module bookmark-link
 */
import Bookmark from "./bookmark.js"

export const ICON_WIDTH = 16

/**
 * @description
 * A BookmarkLink is a link to an URL
 * @example
 * import { BookmarkLink } from "@thoughtsunificator/bookmarks-document"
 */
class BookmarkLink extends Bookmark {

	/**
	 * @param {string} title
	 * @param {string} icon        - The bookmark icon data URL
	 * @param {string} url         - The bookmark URL
	 * @param {Date}   createdAt   - Valid ISO 8601 date string
	 * @param {Date}   [updatedAt] - Valid ISO 8601 date string
	 */
	constructor(title, icon, url, createdAt=null, updatedAt=null) {
		super(title, Bookmark.LINK, createdAt, updatedAt)
		this.icon = icon
		/** @todo parse url and check it there is a protocol, if there isn't add one. */
		this.url = url
	}

	/**
	 * @returns {BookmarkLink}
	 * @todo original property to access the original bookmark
	 * @todo deep
	 */
	clone() {
		const bookmarkLink = new BookmarkLink(this.title, this.icon, this.url, this.createdAt, this.updatedAt)
		bookmarkLink.ownerDocument = this.ownerDocument
		return bookmarkLink
	}

	/**
	 * Return the serializable version of a BookmarkLink (removing any unwanted properties)
	 * @returns {object}
	 */
	serialize() {
		return {
			type: "link",
			title: this.title,
			icon: this.icon,
			url: this.url,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt?.toISOString()
		}
	}

}

export default BookmarkLink

