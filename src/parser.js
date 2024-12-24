/**
 * @module parser
 * @description
 * Serialization and deserialization
 * @example
 * import { Parser } from "@thoughtsunificator/bookmarks-document"
 */

/**
 * This module is responsible for the parsing of internal and external bookmark documents.
 * @todo The Parser module should not have to know any details about the BookmarksDocument. It should work with data payload (DataBookmarkLink & DataBookmarkFolder)
 * @todo Fix netscape bookmark document
 *
 * @typedef {import("./bookmark-folder.js").default}      BookmarkFolder
 * @typedef {import("./bookmark-link.js").default}        BookmarkLink
 *
 * @typedef  {object}                                     DataBookmarkFolder
 * @property {str}                                        type
 * @property {str}                                        title
 * @property {str}                                        createdAt   - Valid ISO 8601 date string
 * @property {str}                                        [updatedAt] - Valid ISO 8601 date string
 * @property {Array<DataBookmarkLink|DataBookmarkFolder>} children
 *
 * @typedef  {object}                                     DataBookmarkLink
 * @property {str}                                        type
 * @property {str}                                        title
 * @property {str}                                        createdAt   - Valid ISO 8601 date string
 * @property {str}                                        [updatedAt] - Valid ISO 8601 date string
 * @property {str}                                        url
 * @property {str}                                        icon
 *
 * BookmarksPayload is used to serialize from and deserialize to a BookmarksDocument
 * @typedef  {Array<DataBookmarkLink|DataBookmarkFolder>} BookmarksPayload
 *
 */
import { BookmarksDocument, Bookmark } from "../index.js"

/**
* Create a BookmarksDocument from a BookmarksPayload
* @param   {BookmarksPayload}  data
* @returns {BookmarksDocument}
*/
export function parseInternalJSON(items) {
	const bookmarksDocument = new BookmarksDocument()
	for(const item of items) {
		const bookmark = deserialize(item, bookmarksDocument.documentElement)
		bookmarksDocument.documentElement.appendChild(bookmark)
	}
	return bookmarksDocument
}

/**
* Create a BookmarksDocument from a Netscape Bookmark File
* @see https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)
* @param   {str}         		  html
* @param   {Document}         document
* @returns {BookmarksDocument}
*/
export function parseHTML(html, document) {
	const div = document.createElement("div")
	div.innerHTML = html
	const bookmarksDocument = new BookmarksDocument(div.querySelector("h1").textContent)
	/**
	* @param {BookmarkFolder}  parent
	* @param {Element}         dlNode
	* @returns {BookmarkFolder}
	*/
	function walk(parent, dlNode) {
		for(const dlChild of dlNode.children) {
			if(dlChild.tagName === "DT") {
				const dtChild = dlChild.firstElementChild
				if(dtChild.tagName === "A") {
					const bookmarkLink = bookmarksDocument.createLink(
						dtChild.textContent,
						dtChild.getAttribute("ICON"),
						dtChild.href,
						new Date(dtChild.getAttribute("ADD_DATE") * 1000)
					)
					const lastModified = dtChild.getAttribute("LAST_MODIFIED")
					if(lastModified > "0") {
						bookmarkLink.updatedAt = new Date(lastModified * 1000)
					}
					parent.appendChild(bookmarkLink)
				} else if(dtChild.tagName === "H3"
					&& dtChild.nextElementSibling && dtChild.nextElementSibling.tagName === "DL") {
					/**
					 * ^ Check nextElementSibling because sometimes there are no dl placeholder, meaning if there is no children the dl node is not added
					 */
					const bookmarkFolder = bookmarksDocument.createFolder(
						dtChild.textContent,
						new Date(dtChild.getAttribute("ADD_DATE") * 1000),
					)
					const lastModified = dtChild.getAttribute("LAST_MODIFIED")
					if(lastModified > "0") {
						bookmarkFolder.updatedAt = new Date(lastModified * 1000)
					}
					parent.appendChild(bookmarkFolder)
					walk(bookmarkFolder, dtChild.nextElementSibling)
				}
			}
		}
	}
	walk(bookmarksDocument.documentElement, div.querySelector("dl"))
	return bookmarksDocument
}

/**
 * @param   {DataBookmarkFolder|DataBookmarkLink} data
 * @param   {BookmarkFolder}                      parentBookmark
 * @returns {BookmarkFolder|BookmarkLink}
 */
export function deserialize(data, parentBookmark) {
	let bookmark = null
	if(data.type === "folder") {
		bookmark = parentBookmark.ownerDocument.createFolder(data.title, new Date(data.createdAt))
		for(const child of data.children) {
			bookmark.appendChild(deserialize(child, bookmark))
		}
	} else if(data.type === "link") {
		bookmark = parentBookmark.ownerDocument.createLink(data.title, data.icon, data.url, new Date(data.createdAt))
	} else {
		throw new Error(`Unknown Bookmark type: ${data.type}. Type must be one of following Symbol: Bookmark.FOLDER or Bookmark.LINK.`)
	}
	if(data.updatedAt) {
		bookmark.updatedAt = new Date(data.updatedAt)
	}
	if(data.attributes) {
		bookmark.attributes = Object.assign(bookmark.attributes, data.attributes)
	}
	return bookmark
}

/**
 * Create a Netscape bookmark document from a bookmarkFolder given a Document is provided
 * @todo untested
 * @todo not working atm because the Netscape Bookmark Document is not valid HTML.
 * There is need for an additional Parser
 * @param   {BookmarksDocument} bookmarksDocument
 * @param   {Document}          document
 * @returns {Document}
 */
export function createNetscapeBookmarkDocument(bookmarksDocument, document) {
	// Creating a new Document type won't be enough because there's still the issue of having multiple root elements
	const netscapeBookmarkDocument = document.implementation.createHTMLDocument("Bookmarks")
	netscapeBookmarkDocument.head.innerHTML +=(`
		<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
		<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; img-src data: *; object-src 'none'"></meta>
	`)
	const rootNode = netscapeBookmarkDocument.createElement("dl")
	netscapeBookmarkDocument.body.appendChild(rootNode)
	const h1 = netscapeBookmarkDocument.createElement("h1")
	const { documentElement } = bookmarksDocument
	h1.textContent = documentElement.title
	rootNode.appendChild(h1)
	/**
	 *
	 * @param {Element}        parentNode
	 * @param {BookmarkFolder} parentBookmarkFolder
	 */
	function walk(parentNode, parentBookmarkFolder) {
		const dl = netscapeBookmarkDocument.createElement("dl")
		const p = netscapeBookmarkDocument.createElement("p")
		dl.appendChild(p)
		for(const childBookmarkFolder of parentBookmarkFolder.children) {
			const dt = netscapeBookmarkDocument.createElement("dt")
			if(childBookmarkFolder.type === Bookmark.FOLDER) {
				const h3 = netscapeBookmarkDocument.createElement("h3")
				h3.textContent = childBookmarkFolder.title
				h3.setAttribute("ADD_DATE", Math.round(childBookmarkFolder.createdAt / 1000))
				if(childBookmarkFolder.updatedAt) {
					h3.setAttribute("LAST_MODIFIED", Math.round((childBookmarkFolder.updatedAt) / 1000))
				} else {
					h3.setAttribute("LAST_MODIFIED", "0")
				}
				dt.appendChild(h3)
				/**
				 * Do not add an empty dl node if there are no children
				 */
				walk(dt, childBookmarkFolder)
			} else if(childBookmarkFolder.type === Bookmark.LINK) {
				const a = netscapeBookmarkDocument.createElement("a")
				a.href = childBookmarkFolder.url
				a.textContent = childBookmarkFolder.title
				if(childBookmarkFolder.icon) {
					a.setAttribute("ICON", childBookmarkFolder.icon)
				}
				a.setAttribute("ADD_DATE", Math.round(childBookmarkFolder.createdAt / 1000))
				if(childBookmarkFolder.updatedAt) {
					a.setAttribute("LAST_MODIFIED", Math.round((childBookmarkFolder.updatedAt) / 1000))
				}
				dt.appendChild(a)
			}
			p.appendChild(dt)
		}
		parentNode.appendChild(dl)
	}
	walk(rootNode, documentElement)
	return netscapeBookmarkDocument
}
