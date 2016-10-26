module Bkmrkd exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

type alias Model =
  {}

type Msg =
  Nothing

initialModel : Model
initialModel =
  {}

view : Model -> Html Msg
view model =
  div [ class "app" ] [ text "Hello!" ]

main : Html Msg
main =
  view initialModel
