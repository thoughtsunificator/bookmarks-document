import ava from "ava"
import { JSDOM } from "jsdom"
import { BookmarkFolder, BookmarkLink, Parser } from "../index.js"

ava("Parse internal JSON", (test) => {
	const bookmarksDocument = Parser.parseInternalJSON(
		[
			{
				"type": "folder",
				"title": "New Folder 1",
				"createdAt": "2024-10-20T23:07:45.034Z",
				"updatedAt": "2024-11-20T23:07:45.034Z",
				"children": [
					{
						"type": "folder",
						"title": "New Folder 2",
						"createdAt": "2024-10-20T23:07:46.916Z",
						"updatedAt": null,
						"attributes": { "foo": "bar" },
						"children": [
							{
								"type": "folder",
								"title": "New Folder 3",
								"createdAt": "2024-10-20T23:07:47.795Z",
								"updatedAt": null,
								"children": []
							}
						]
					}
				]
			},
			{
				"type": "folder",
				"title": "New Folder 4",
				"createdAt": "2024-10-20T23:07:45.989Z",
				"updatedAt": null,
				"children": [
					{
						"type": "folder",
						"title": "New Folder 5",
						"createdAt": "2024-10-20T23:07:47.350Z",
						"updatedAt": null,
						"children": [
							{
								"type": "link",
								"title": "New Link",
								"createdAt": "2024-10-20T23:07:46.475Z",
								"updatedAt": null,
								"icon": "data:image/png;base64,i",
								"url": "https://example.com"
							}
						]
					}
				]
			},
			{
				"type": "folder",
				"title": "New Folder 6",
				"createdAt": "2024-10-20T23:07:46.475Z",
				"updatedAt": null,
				"children": []
			}
		]
	)
	test.is(bookmarksDocument.documentElement.children.length, 3)
	test.is(bookmarksDocument.documentElement.children[0].title, "New Folder 1")
	test.deepEqual(bookmarksDocument.documentElement.children[0].createdAt, new Date("2024-10-20T23:07:45.034Z"))
	test.deepEqual(bookmarksDocument.documentElement.children[0].updatedAt, new Date("2024-11-20T23:07:45.034Z"))
	test.true(bookmarksDocument.documentElement.children[0] instanceof BookmarkFolder)
	test.is(bookmarksDocument.documentElement.children[0].children[0].title, "New Folder 2")
	test.deepEqual(bookmarksDocument.documentElement.children[0].children[0].attributes, { foo: "bar" })
	test.is(bookmarksDocument.documentElement.children[0].children[0].children[0].title, "New Folder 3")
	test.is(bookmarksDocument.documentElement.children[1].title, "New Folder 4")
	test.is(bookmarksDocument.documentElement.children[1].children[0].title, "New Folder 5")
	test.is(bookmarksDocument.documentElement.children[1].children[0].children[0].title, "New Link")
	test.true(bookmarksDocument.documentElement.children[1].children[0].children[0] instanceof BookmarkLink)
	test.is(bookmarksDocument.documentElement.children[1].children[0].children[0].icon, "data:image/png;base64,i")
	test.is(bookmarksDocument.documentElement.children[1].children[0].children[0].url, "https://example.com")
	test.deepEqual(bookmarksDocument.documentElement.children[1].children[0].children[0].createdAt, new Date("2024-10-20T23:07:46.475Z"))
	test.is(bookmarksDocument.documentElement.children[2].title, "New Folder 6")
})

ava("Parse HTML file", (test) => {
	const virtualDOM = new JSDOM()
	const document = virtualDOM.window.document
	const bookmarksDocument = Parser.parseHTML(`
		<h1>Bookmarks Toolbar</h1>
		<dl>
			<p></p>
			<dt>
				<h3 add_date="1629705757" last_modified="1726160309" personal_toolbar_folder="true">Category</h3>
				<dl>
					<p></p>
					<dt>
						<h3 add_date="1629705757" last_modified="1725247279">Discover</h3>
						<dl>
							<p></p>
							<dt>
								<a href="https://example.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc" icon="data:image/png;base64,i">Link Title</a>
							</dt>
						</dl>
					</dt>
				</dl>
			</dt>
			<dt>
				<h3 add_date="1629705757" last_modified="1726160309" personal_toolbar_folder="true">Unclassified</h3>
				<dl>
					<p></p>
					<dt>
						<a href="https://example2.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc2" icon="data:image/png;base64,i2">Link Title2</a>
					</dt>
				</dl>
			</dt>
			<dt>
				<a href="https://example3.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc3" icon="data:image/png;base64,i3">Link title3</a>
			</dt>
			<dt>
				<a href="https://example4.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc24" icon="data:image/png;base64,i4">Link title4</a>
			</dt>
		</dl>
	`, document)
	test.is(bookmarksDocument.documentElement.title, "Bookmarks Toolbar")
	test.is(bookmarksDocument.documentElement.children.length, 4)
	test.is(bookmarksDocument.documentElement.children[0].title, "Category")
	test.is(bookmarksDocument.documentElement.children[0].children.length, 1)
	test.is(bookmarksDocument.documentElement.children[0].children[0].title, "Discover")
	test.is(bookmarksDocument.documentElement.children[0].children[0].children[0].title, "Link Title")
	test.is(bookmarksDocument.documentElement.children[0].children[0].children[0].url, "https://example.com/")
	test.is(bookmarksDocument.documentElement.children[0].children[0].children[0].icon, "data:image/png;base64,i")
	test.is(bookmarksDocument.documentElement.children[1].title, "Unclassified")
	test.is(bookmarksDocument.documentElement.children[1].children.length, 1)
	test.is(bookmarksDocument.documentElement.children[2].title, "Link title3")
	test.is(bookmarksDocument.documentElement.children[2].icon, "data:image/png;base64,i3")
	test.is(bookmarksDocument.documentElement.children[2].url, "https://example3.com/")
	test.is(bookmarksDocument.documentElement.children[3].title, "Link title4")
	test.is(bookmarksDocument.documentElement.children[3].icon, "data:image/png;base64,i4")
	test.is(bookmarksDocument.documentElement.children[3].url, "https://example4.com/")
})

ava("Transform a BookmarksDocument into a Netscape Document", test => {
	const virtualDOM = new JSDOM()
	const { document } = virtualDOM.window
	const html =`
		<h1>Bookmarks Toolbar</h1>
		<dl>
			<p></p>
			<dt>
				<h3 add_date="1629705757" last_modified="1726160309" personal_toolbar_folder="true">Category</h3>
				<dl>
					<p></p>
					<dt>
						<h3 add_date="1629705757" last_modified="1725247279">Discover</h3>
						<dl>
							<p></p>
							<dt>
								<a href="https://example.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc" icon="data:image/png;base64,i">Link Title</a>
							</dt>
						</dl>
					</dt>
				</dl>
			</dt>
			<dt>
				<h3 add_date="1629705757" last_modified="1726160309" personal_toolbar_folder="true">Unclassified</h3>
				<dl>
					<p></p>
					<dt>
						<a href="https://example2.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc2" icon="data:image/png;base64,i2">Link Title2</a>
					</dt>
				</dl>
			</dt>
			<dt>
				<a href="https://example3.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc3" icon="data:image/png;base64,i3">Link title3</a>
			</dt>
			<dt>
				<a href="https://example4.com" add_date="1713717844" last_modified="1713717844" icon_uri="https://abc24" icon="data:image/png;base64,i4">Link title4</a>
			</dt>
		</dl>
	`
	const bookmarksDocument = Parser.parseHTML(html, document)
	const netscapeBookmarksDocument = Parser.createNetscapeBookmarkDocument(bookmarksDocument, document)
	test.is(netscapeBookmarksDocument.querySelector("h1").textContent, "Bookmarks Toolbar")
	test.is(netscapeBookmarksDocument.querySelectorAll("a").length, 4)
	test.is(netscapeBookmarksDocument.querySelectorAll("h3").length, 3)
	test.is(netscapeBookmarksDocument.querySelectorAll("a")[1].textContent, "Link Title2")
})
