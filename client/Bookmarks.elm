module Bookmarks exposing (..)

import Helpers exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Attributes.Aria exposing (..)
import Html.Events exposing (onWithOptions, Options)
import Json.Decode as Json
import Store exposing (..)


paginationClass : Bool -> String
paginationClass enabled =
    if enabled then
        ""
    else
        " pagination__link--disabled"


stopOrContinue : Int -> Bool -> Msg
stopOrContinue page enabled =
    if enabled then
        ChangePageNumber page
    else
        Store.Nothing


previousButton : Int -> Html Msg
previousButton page =
    let
        enabled =
            page > 1

        extraClass =
            paginationClass enabled
    in
        a
            [ ariaDisabled <| not enabled
            , class ("pagination__link pagination__link--previous" ++ extraClass)
            , href <| "/?page=" ++ (toString <| page - 1)
            , onWithOptions "click" navigationOptions (Json.succeed <| stopOrContinue (page - 1) <| enabled)
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
        a
            [ ariaDisabled <| not enabled
            , class ("pagination__link pagination__link--next" ++ extraClass)
            , href <| "/?page=" ++ (toString <| model.currentPageNumber - 1)
            , onWithOptions "click" navigationOptions (Json.succeed <| stopOrContinue (model.currentPageNumber + 1) <| enabled)
            ]
            [ text "next" ]


emptyBookmarks : Html Msg
emptyBookmarks =
    li [ class "bookmark bookmark--empty" ]
        [ text "You don't have any bookmarks saved yet! As soon as you add one, it will show up here." ]

loadingBookmarks : Html Msg
loadingBookmarks =
    li [ class "bookmark bookmark--empty" ]
        [ text "Loading..." ]


bookmarksList : Model -> List (Html Msg)
bookmarksList model =
    if model.loading == True then
        [ loadingBookmarks ]
    else if List.length model.bookmarks == 0 then
        [ emptyBookmarks ]
    else
        List.map bookmarkItem model.bookmarks


view : Model -> Html Msg
view model =
    section [ class "site-constraint bookmarks-list" ]
        [ ul [] (bookmarksList model)
        , nav [ class "pagination" ]
            [ (previousButton model.currentPageNumber), (nextButton model) ]
        ]
