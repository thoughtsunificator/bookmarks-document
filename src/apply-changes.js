/**
 * @deprecated
 * Apply a given set of changes to a BookmarkDocument
 * @param {BookmarksDocument} bookmarksDocument
 * @param {Array<Change>} changes
 * @returns {BookmarksDocument}
 */
export default function(bookmarksDocument, changes) {
	const { documentElement } = bookmarksDocument
	/** Map a path to a Bookmark **/

	let paths = {
		"/Root": documentElement
	}

	/** Some Bookmarks might change path in the process
	 *  which means the paths map need to be updated
	 *  accordingly
	 */
	function updatePaths() {
		const newPaths = {}

		for(const bookmark of Object.values(paths)) {
			if(bookmark.parent) {
				newPaths[bookmark.path] = bookmark
			}
		}

		paths = newPaths
	}

	for(const change of changes) {
		const { type, date } = change
		const { target } = change.arguments

		if(type === "newFolder") {
			const parentBookmarkFolder = paths[target]
			const bookmarkFolder = bookmarksDocument.createFolder(BookmarkFolder.DEFAULT_TITLE, date)
			parentBookmarkFolder.appendChild(bookmarkFolder)
			paths[bookmarkFolder.path] = bookmarkFolder
		}

		if(type === "newLink") {
			const { form } = change.arguments
			const parentBookmarkFolder = paths[target]
			const bookmarkLink = bookmarksDocument.createLink(form.title, form.icon, form.url, date)
			parentBookmarkFolder.appendChild(bookmarkLink)
			paths[bookmarkLink.path] = bookmarkLink
		}

		if(type === "renameBookmark") {
			const bookmark = paths[target]
			paths[target].title = change.arguments.title
			bookmark.updatedAt = date
			/**
			 * Because the bookmark that has been renamed
			 * might have been the parent of one or many bookmarks
			 * all paths need to be updated
			 */
			updatePaths()
		}

		if(type === "updateBookmarkLink") {
			const bookmarkLink = paths[target]
			const { title, icon, url } = change.arguments.form
			bookmarkLink.icon = icon
			bookmarkLink.url = url
			if(title) {
				bookmarkLink.title = title
				updatePaths()
			}
		}

		if(type === "deleteBookmark") {
			paths[target].remove()
			delete paths[target]
		}

		if(type === "dragBookmark") {
			const drag = change.arguments
			const { offset } = drag
			const source = paths[drag.source]
			const dragTarget = paths[drag.target]
			if(offset !== null && dragTarget.parent) {
				if(offset === Drag.OFFSET_ABOVE) {
					dragTarget.parent.insertBefore(source, dragTarget)
				} else {
					dragTarget.parent.insertAfter(source, dragTarget)
				}
			} else if(dragTarget.type === Bookmark.FOLDER
				&& source.parent !== dragTarget
				&& (source.type !== Bookmark.FOLDER || !source.contains(dragTarget))) {
				dragTarget.appendChild(source)
			}
			updatePaths()
		}

		if(type === "import") {
			/**
			 * @todo Fix deleteBookmark issue where the bookmarks are deleted after instead of before
			 * This is because of unshift.
			 */
			const { replace, bookmarks } = change.arguments
			if(replace) {
				for(const child of documentElement.children.slice()) {
					child.remove()
				}
			}
			const importedDocument = Parser.parseInternalJSON(bookmarks)
			for(const bookmark of importedDocument.documentElement.children.slice()) {
				bookmarksDocument.documentElement.appendChild(bookmark)
			}
			const treeWalker = bookmarksDocument.createTreeWalker(bookmarksDocument.documentElement)
			while (treeWalker.nextBookmark()) {
				paths[treeWalker.currentBookmark.path] = treeWalker.currentBookmark
			}
			updatePaths()
		}

	}
}

