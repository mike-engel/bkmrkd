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


helpers do

end

get '/' do
  @bookmarks = bookmarks.find.to_a.reverse!
  if @bookmarks
    puts 'found some bookmarks'
  else
    puts 'couldn\'t find any bookmarks'
  end
  haml :index
end

get '/colophon' do
  haml :colophon
end

get '/delete/:token' do
  @id = params[:token].to_i(10)
  bookmarks.remove("id" => @id)
  flash.next[:success] = 'Bookmarklet deleted successfully'
  redirect '/'
end

get '/add' do
  @title = params['title']
  @url = params['url']
  @callback = params['callback']
  @action = params['action']
  @id = bookmarks.count + 1
  @formatted_url = @url.split('/')[2]

  @bookmark = bookmarks.insert("id" => @id, "title" => @title, "url" => @url, "formatted_url" => @formatted_url, "date_added" => Time.now)

  if @action === 'close'
    return 'window.close();'
  end
end
