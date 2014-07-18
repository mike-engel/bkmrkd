require 'sinatra'
require 'sinatra/flash'
require 'sinatra/partial'
require 'sinatra/reloader' if development?

require 'unicorn'
require 'haml'
require 'redcarpet'

require 'mongo'

include Mongo

db = MongoClient.new(ENV["DATABASE_URL"] || "localhost", 27017).db("bkmrkd")
bookmarks = db.collection('bookmarks')

links_per_page = 25.0
bookmark_next_id = 7

helpers do

end

get '/' do
    if params[:page]
        @page_number = params[:page].to_i
    else
        @page_number = 1
    end

    @bookmark_pages = (bookmarks.count / links_per_page).ceil
    @bookmarks = bookmarks.find.sort(id: :desc).skip(links_per_page * (@page_number - 1)).limit(links_per_page).to_a

    puts "number of bookmarks: #{bookmarks.count}"
    puts "page number: #{@page_number}"
    puts "number of pages: #{@bookmark_pages}"

    haml :index
end

get '/colophon' do
    haml :colophon
end

get '/delete/:token' do
    @id = params[:token].to_i
    bookmarks.remove(id: @id)
    flash.next[:success] = 'Bookmarklet deleted successfully'
    redirect '/'
end

get '/add' do
    @title = params['title']
    @url = params['url']
    @callback = params['callback']
    @action = params['action']
    @formatted_url = @url.split('/')[2]

    @bookmark = bookmarks.insert(id: bookmark_next_id, title: @title, url: @url, formatted_url: @formatted_url, date_added: Time.now)

    bookmark_next_id += 1

    if @action === 'close'
        return 'javascript:window.close();'
    end
end
