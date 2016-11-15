module Header exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Store exposing (Model, Msg(..), Page)


navLink : Page -> String -> String -> Html Msg
navLink currentPage url title =
    li [] [ a [ href url ] [ text title ] ]


view : Model -> Html Msg
view model =
    div [ class "header" ]
        [ h1 [ class "logo" ] [ text "bkmrkd" ]
        , nav [ class "nav" ]
            [ ul []
                [ navLink model.selectedPage "/" "bookmarks"
                , navLink model.selectedPage "/colophon" "colophon"
                , navLink model.selectedPage "#" "bookmark"
                ]
            ]
        ]
