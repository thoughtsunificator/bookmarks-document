/**
 * @module virtual-bookmark-folder
 */
import BookmarkFolder from "./bookmark-folder.js"

/**
 * A virtual bookmark folder is used to represent a temporary bookmark folder.
 * @example
 * import { VirtualBookmarkFolder } from "@thoughtsunificator/bookmarks-document"
 */
class VirtualBookmarkFolder extends BookmarkFolder {

	add(bookmarkFolder) {
		const clone = bookmarkFolder.clone(true)
		clone.original = bookmarkFolder
		this.appendChild(clone)
	}
}

export default VirtualBookmarkFolder
