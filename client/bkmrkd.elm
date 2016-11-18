module Bkmrkd exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Header
import Bookmarks
import Store exposing (..)


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ Header.view model
        , Bookmarks.view model
        ]


main =
    Html.program
        { init = (initialModel FetchBookmarks)
        , update = update
        , view = view initialModel
        , subscriptions = Maybe.Nothing
        }
