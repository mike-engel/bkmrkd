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


view : Model -> Html Msg
view model =
    section [ class "bookmarks-list" ]
        [ ul [] (List.map bookmarkItem model.bookmarks) ]
