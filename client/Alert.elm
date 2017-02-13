module Alert exposing (..)

import Helpers exposing (navigationOptions)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Attributes.Aria exposing (..)
import Html.Events exposing (onWithOptions)
import Json.Decode as Json
import Store exposing (Model, Msg(ClearAlert))


isHidden : String -> Bool
isHidden alertType =
    if alertType == "" then
        True
    else
        False


view : Model -> Html Msg
view model =
    let
        alertType =
            Tuple.first model.alert

        alertMessage =
            Tuple.second model.alert

        alertClassName =
            if isHidden alertType then
                "alert--hidden"
            else
                "alert--" ++ alertType
    in
        div
            [ ariaHidden <| isHidden alertType
            , ariaLive "assertive"
            , class <| "site-constraint alert " ++ alertClassName
            , role "alert"
            ]
            [ p [ class "alert__message" ] [ text alertMessage ]
            , a
                [ class "alert__action"
                , href "#"
                , onWithOptions "click" navigationOptions (Json.succeed ClearAlert)
                ]
                [ text "close" ]
            ]
