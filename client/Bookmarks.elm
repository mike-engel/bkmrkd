module Bookmarks exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Erl
import Store exposing (Bookmark, Model, Msg(..))


bookmarkSite : String -> String
bookmarkSite url =
    let
        urlRecord =
            Erl.parse url
    in
        String.join "." urlRecord.host


bookmarkItem : Bookmark -> Html Msg
bookmarkItem bookmark =
    li [ class "bookmark" ]
        [ a [ class "bookmark__link", href bookmark.url ] [ text bookmark.title ]
        , span [ class "bookmark__date" ] [ text bookmark.createdAt ]
        , span [ class "bookmark__source" ] [ text (bookmarkSite bookmark.url) ]
        , a [ class "bookmark__delete", href ("/api/bookmarks/" ++ (toString bookmark.id)) ] [ text "delete" ]
        ]


emptyBookmarks : Html Msg
emptyBookmarks =
    li [ class "bookmark bookmark--empty" ]
        [ text "You don't have any bookmarks saved yet! As soon as you add one, it will show up here." ]


bookmarksList : List Bookmark -> List (Html Msg)
bookmarksList bookmarks =
    if List.length bookmarks == 0 then
        [ emptyBookmarks ]
    else
        List.map bookmarkItem bookmarks


view : Model -> Html Msg
view model =
    section [ class "bookmarks-list" ]
        [ ul [] (bookmarksList model.bookmarks) ]
