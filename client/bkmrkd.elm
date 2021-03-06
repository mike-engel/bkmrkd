module Bkmrkd exposing (..)

import Alert
import Bookmarks
import Colophon
import Header
import Html exposing (..)
import Html.Attributes exposing (..)
import Navigation exposing (Location)
import NotFound
import Router
    exposing
        ( Route
            ( BookmarksRoute
            , ColophonRoute
            , NotFoundRoute
            , SearchRoute
            )
        , parseLocation
        )
import SearchResults
import Store
    exposing
        ( initialModel
        , getBookmarks
        , Model
        , Msg(OnLocationChange)
        , searchBookmarks
        , update
        )


page : Model -> Html Msg
page model =
    case model.currentPage of
        BookmarksRoute _ ->
            Bookmarks.view model

        ColophonRoute ->
            Colophon.view

        SearchRoute _ ->
            SearchResults.view model

        NotFoundRoute ->
            NotFound.view


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ Alert.view model
        , Header.view model
        , page model
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    let
        currentRoute =
            parseLocation location

        model =
            initialModel currentRoute location
    in
        update (OnLocationChange location) model


main : Program Never Model Msg
main =
    Navigation.program OnLocationChange
        { init = init
        , subscriptions = (\_ -> Sub.none)
        , update = update
        , view = view
        }
