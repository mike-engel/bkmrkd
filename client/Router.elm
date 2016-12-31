module Router exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)


type Route
    = BookmarksRoute
    | SearchRoute String
    | ColophonRoute
    | NotFoundRoute


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map BookmarksRoute top
        , map ColophonRoute (s "colophon")
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parsePath matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundRoute