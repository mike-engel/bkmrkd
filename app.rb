require 'sinatra'
require 'sinatra/flash'
require 'sinatra/partial'
require 'sinatra/reloader' if development?

require 'unicorn'
require 'haml'
require 'redcarpet'

require 'data_mapper'
require 'will_paginate'
require 'will_paginate/data_mapper'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite://#{File.expand_path(File.dirname(__FILE__))}/db/main.db")

helpers do

end

class Bookmark
  include DataMapper::Resource

  property :id, Serial
  property :title, Text, required: true
  property :url, Text, required: true
  property :formatted_url, String, required: true
  property :date_added, DateTime, required: true
end

DataMapper.finalize
DataMapper.auto_migrate!

get '/' do
  @bookmarks = Bookmark.paginate(page: params[:page], per_page: 25).reverse!
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
  @bookmarklet = Bookmark.get(params[:token])
  @bookmarklet.destroy()
  flash.next[:success] = 'Bookmarklet deleted successfully'
  redirect '/'
end

get '/add' do
  @title = params['title']
  @url = params['url']
  @callback = params['callback']
  @formatted_url = @url.split('/')[2]

  @bookmark = Bookmark.new(title: @title, url: @url, formatted_url: @formatted_url, date_added: Time.now)

  if @bookmark.valid?
    @bookmark.save
    return "alert(200, null, {'message': 'Bookmarklet saved successfully!'})"
  else
    return "alert(500, #{@bookmark.errors}, {'message': 'Bookmarklet could not be saved.'})"
  end
end