module Header exposing (..)

import Json.Decode as Json
import Helpers exposing (navigationOptions)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onWithOptions, Options)
import Router exposing (..)
import Store exposing (Model, Msg(..))


navLink : Route -> Route -> String -> String -> Html Msg
navLink currentPage route url title =
    li []
        [ a
            [ href url, onWithOptions "click" navigationOptions (Json.succeed (switchPage route)) ]
            [ text title ]
        ]


switchPage : Route -> Msg
switchPage newRoute =
    case newRoute of
        BookmarksRoute ->
            ShowBookmarks

        ColophonRoute ->
            ShowColophon

        SearchRoute _ ->
            Store.Nothing

        NotFoundRoute ->
            Store.Nothing


view : Model -> Html Msg
view model =
    div [ class "header" ]
        [ h1 [ class "logo" ] [ text "bkmrkd" ]
        , nav [ class "nav" ]
            [ ul []
                [ navLink model.currentPage BookmarksRoute "/" "bookmarks"
                , navLink model.currentPage ColophonRoute "/colophon" "colophon"
                , navLink model.currentPage NotFoundRoute "#" "bookmark"
                ]
            ]
        , Html.form [ onWithOptions "submit" navigationOptions (Json.succeed (switchPage SearchRoute)) ] []
        ]
