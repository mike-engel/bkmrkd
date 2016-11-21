module Bkmrkd exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Header
import Bookmarks
import Store exposing (..)
import WebSocket


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ Header.view model
        , Bookmarks.view model
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    WebSocket.listen "ws://echo.websocket.org" NewMessage


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, getBookmarks )
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
