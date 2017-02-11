module Colophon exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Store exposing (..)


view : Html Msg
view =
    section [ class "colophon" ]
        [ h1 [ class "h1" ] [ text "Colophon" ]
        , p []
            [ text "bkmrkd was created by "
            , a [ href "https://mike-engel.com", target "_blank" ] [ text "Mike Engel" ]
            , text " as an experiment in creating a service tied to a bookmarklet. Since then it's been rewritten in "
            , a [ href "https://nodejs.org", target "_blank" ] [ text "Node" ]
            , text " and "
            , a [ href "https://elm-lang.org", target "_blank" ] [ text "Elm" ]
            , text ". It's used as a playground for new web dev techniques such as isomorphic rendering, service worker, etc."
            ]
        , p []
            [ text "To add bookmarks here, simply drag the bookmarklet link in the navigation to your bookmarks bar (or favorites bar or whatever) and click it when you're on a page you want to save for later." ]
        , p []
            [ text "You can view the code on "
            , a [ href "https://github.com/mike-engel/bkmrkd", target "_blank" ] [ text "Github" ]
            , text ", and file "
            , a [ href "https://github.com/mike-engel/bkmrkd/issues", target "_blank" ] [ text "issues" ]
            , text " there too."
            ]
        ]
