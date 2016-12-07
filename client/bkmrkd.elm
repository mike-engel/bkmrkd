module Bkmrkd exposing (..)

import Bookmarks
import Colophon
import Header
import Html exposing (..)
import Html.Attributes exposing (..)
import Navigation exposing (Location)
import NotFound
import Router exposing (..)
import Store exposing (..)
import WebSocket


page : Model -> Html Msg
page model =
    case model.currentPage of
        BookmarksRoute ->
            Bookmarks.view model

        ColophonRoute ->
            Colophon.view

        SearchRoute _ ->
            NotFound.view

        NotFoundRoute ->
            NotFound.view


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ Header.view model
        , page model
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    let
        currentRoute =
            parseLocation location

        model =
            initialModel currentRoute
    in
        ( model, getBookmarks model.currentPageNumber )


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen "ws://echo.websocket.org" NewMessage


main : Program Never Model Msg
main =
    Navigation.program OnLocationChange
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
