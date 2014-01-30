Bookmarklet service database schema

table BOOKMARKS
	property :id, Increment
	property :name, String
	property :url, Text
	property :date_added, Date