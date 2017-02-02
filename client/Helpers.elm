module Helpers exposing (..)

import Date exposing (..)
import Date.Format exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onWithOptions, Options)
import Erl
import Json.Decode as Json
import Result exposing (toMaybe)
import Store exposing (..)


navigationOptions : Options
navigationOptions =
    { stopPropagation = False
    , preventDefault = True
    }


bookmarkSite : String -> String
bookmarkSite url =
    let
        urlRecord =
            Erl.parse url
    in
        String.join "." urlRecord.host


parseDate : String -> Maybe Date
parseDate dateString =
    toMaybe (fromString dateString)


formatDate : Maybe Date -> String
formatDate maybeDate =
    case maybeDate of
        Just date ->
            format "%B %e, %Y" date

        Maybe.Nothing ->
            ""


bookmarkItem : Bookmark -> Html Msg
bookmarkItem bookmark =
    li [ class "bookmark" ]
        [ a [ class "bookmark__link", href bookmark.url, target "_blank" ]
            [ text bookmark.title ]
        , span [ class "bookmark__date" ]
            [ text (bookmark.createdAt |> parseDate |> formatDate) ]
        , span [ class "bookmark__source" ] [ text (bookmarkSite bookmark.url) ]
        , a
            [ class "bookmark__delete"
            , href ("/api/bookmarks/" ++ (toString bookmark.id))
            , onWithOptions "click" navigationOptions (Json.succeed (DeleteBookmark bookmark.id))
            ]
            [ text "delete" ]
        ]
