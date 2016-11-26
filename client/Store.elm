module Store exposing (..)

import Http
import Json.Decode exposing (..)
import Navigation exposing (Location, newUrl)
import Router exposing (..)


type alias Model =
    { bookmarks : List Bookmark
    , currentPage : Route
    }


type alias Bookmark =
    { id : Int
    , title : String
    , url : String
    , createdAt : String
    }


type Msg
    = FetchBookmarks
    | NewBookmarks (Result Http.Error (List Bookmark))
    | NewMessage String
    | OnLocationChange Location
    | ShowBookmarks
    | ShowColophon
    | Nothing


getBookmarks : Cmd Msg
getBookmarks =
    let
        url =
            "/api/bookmarks"

        request =
            Http.get url decodeBookmarks
    in
        Http.send NewBookmarks request


decodeBookmarks : Decoder (List Bookmark)
decodeBookmarks =
    list decodeBookmark


decodeBookmark : Decoder Bookmark
decodeBookmark =
    map4 Bookmark
        (at [ "id" ] int)
        (at [ "title" ] string)
        (at [ "url" ] string)
        (at [ "createdAt" ] string)


initialModel : Route -> Model
initialModel currentPage =
    { bookmarks = []
    , currentPage = currentPage
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchBookmarks ->
            ( model, getBookmarks )

        NewBookmarks (Ok bookmarkList) ->
            ( { model | bookmarks = bookmarkList }, Cmd.none )

        NewBookmarks (Err _) ->
            ( model, Cmd.none )

        NewMessage str ->
            ( model, Cmd.none )

        OnLocationChange location ->
            let
                newRoute =
                    parseLocation location
            in
                ( { model | currentPage = newRoute }, Cmd.none )

        ShowBookmarks ->
            ( model, newUrl "/" )

        ShowColophon ->
            ( model, newUrl "/colophon" )

        Nothing ->
            ( model, Cmd.none )
