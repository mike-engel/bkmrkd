module Header exposing (..)

import Bookmarklet exposing (bookmarkletCode)
import Json.Decode as Json
import Helpers exposing (navigationOptions)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Attributes.Aria exposing (..)
import Html.Events exposing (onInput, onSubmit, onWithOptions, Options)
import Router exposing (..)
import Store exposing (Model, Msg(..))


navLink : Route -> Route -> String -> String -> Html Msg
navLink currentPage route url title =
    let
        active =
            compareRoutes currentPage route

        extraClass =
            if active then
                " active"
            else
                ""
    in
        li []
            [ a
                [ href url
                , onWithOptions "click" navigationOptions (Json.succeed (switchPage route url))
                , class <| "nav__link" ++ extraClass
                ]
                [ text title ]
            ]


switchPage : Route -> String -> Msg
switchPage newRoute path =
    case newRoute of
        BookmarksRoute _ ->
            Navigate path

        ColophonRoute ->
            Navigate path

        SearchRoute _ ->
            Navigate path

        NotFoundRoute ->
            Store.Nothing


view : Model -> Html Msg
view model =
    div [ class "header" ]
        [ div [ class "site-constraint" ]
            [ h1 [ class "h1 logo" ] [ text "bkmrkd" ]
            , Html.form
                [ onSubmit (switchPage (SearchRoute <| Just <| "/search?term=" ++ model.searchTerm) ("/search?term=" ++ model.searchTerm))
                , class "header__bookmark-search"
                , role "form"
                , action <| "/search?term=" ++ model.searchTerm
                ]
                [ label [ for "search-input", class "header__search-label" ] [ text "search your bookmarks" ]
                , input
                    [ type_ "search"
                    , class "header__search-input"
                    , id "search-input"
                    , placeholder "search your bookmarks"
                    , onInput UpdateSearchTerm
                    ]
                    []
                ]
            , nav [ class "nav" ]
                [ ul []
                    [ navLink model.currentPage (BookmarksRoute <| Just 1) "/" "bkmrkd"
                    , navLink model.currentPage ColophonRoute "/colophon" "colophon"
                    , navLink model.currentPage NotFoundRoute (bookmarkletCode model.urlPrefix) "bookmarklet"
                    ]
                ]
            ]
        ]
