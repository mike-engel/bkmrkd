module Bookmarks exposing (..)

import Date exposing (..)
import Date.Format exposing (..)
import Erl
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onWithOptions, Options)
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


paginationClass : Bool -> String
paginationClass enabled =
    if enabled then
        ""
    else
        " pagination--disabled"


previousButton : Int -> Html Msg
previousButton page =
    let
        enabled =
            page > 1

        extraClass =
            paginationClass enabled
    in
        span
            [ class ("pagination__previous" ++ extraClass)
            , onWithOptions "click" navigationOptions (Json.succeed (ChangePageNumber (page - 1)))
            ]
            [ text "previous" ]


nextButton : Model -> Html Msg
nextButton model =
    let
        enabled =
            List.length model.bookmarks == 25

        extraClass =
            paginationClass enabled
    in
        span
            [ class ("pagination__next" ++ extraClass)
            , onWithOptions "click" navigationOptions (Json.succeed (ChangePageNumber (model.currentPageNumber + 1)))
            ]
            [ text "next" ]


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
        [ ul [] (bookmarksList model.bookmarks)
        , nav [ class "pagination" ]
            [ (previousButton model.currentPageNumber), (nextButton model) ]
        ]
