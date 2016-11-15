module Bkmrkd exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Header
import Store exposing (..)


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ Header.view model ]


main : Html Msg
main =
    view initialModel
