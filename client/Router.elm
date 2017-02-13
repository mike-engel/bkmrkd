module Router exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)


type Route
    = BookmarksRoute (Maybe Int)
    | SearchRoute (Maybe String)
    | ColophonRoute
    | NotFoundRoute


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map BookmarksRoute (s "" <?> intParam "page")
        , map ColophonRoute (s "colophon")
        , map SearchRoute (s "search" <?> stringParam "term")
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parsePath matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundRoute


compareRoutes : Route -> Route -> Bool
compareRoutes a b =
    case ( a, b ) of
        ( BookmarksRoute _, BookmarksRoute _ ) ->
            True

        ( SearchRoute _, SearchRoute _ ) ->
            True

        ( ColophonRoute, ColophonRoute ) ->
            True

        ( NotFoundRoute, NotFoundRoute ) ->
            True

        ( _, _ ) ->
            False
