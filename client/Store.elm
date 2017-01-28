module Store exposing (..)

import Http exposing (..)
import Json.Decode exposing (..)
import Erl
import Navigation exposing (Location, newUrl)
import Router exposing (..)


type alias Model =
    { bookmarks : List Bookmark
    , currentPage : Route
    , currentPageNumber : Int
    }


type alias Bookmark =
    { id : Int
    , title : String
    , url : String
    , createdAt : String
    }


type Msg
    = ChangePageNumber Int
    | DeleteBookmark Int
    | FetchBookmarks
    | NewBookmarks (Result Http.Error (List Bookmark))
    | NewMessage String
    | OnLocationChange Location
    | ShowBookmarks
    | ShowColophon
    | Nothing


getUrlPageNumber : String -> Int
getUrlPageNumber url =
    let
        urlRecord =
            Erl.parse url

        pageList =
            Erl.getQueryValuesForKey "page" urlRecord
    in
        case List.head pageList of
            Just pageNumberString ->
                case String.toInt pageNumberString of
                    Ok pageNumber ->
                        pageNumber

                    Err _ ->
                        1

            Maybe.Nothing ->
                1


getBookmarks : Int -> Cmd Msg
getBookmarks pageNumber =
    let
        url =
            "/api/bookmarks?page=" ++ (toString pageNumber)

        request =
            Http.get url decodeBookmarks
    in
        Http.send NewBookmarks request


deleteBookmark : Int -> Cmd Msg
deleteBookmark id =
    let
        url =
            "/api/bookmarks/" ++ (toString id)

        request =
            Http.request
                { method = "DELETE"
                , headers = []
                , url = url
                , body = emptyBody
                , expect = expectJson decodeBookmarks
                , timeout = Maybe.Nothing
                , withCredentials = False
                }
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
    , currentPageNumber = 1
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangePageNumber newPage ->
            ( { model | currentPageNumber = newPage }, (getBookmarks newPage) )

        DeleteBookmark id ->
            ( model, (deleteBookmark id) )

        FetchBookmarks ->
            ( model, (getBookmarks model.currentPageNumber) )

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
                ( { model
                    | currentPage = newRoute
                    , currentPageNumber = getUrlPageNumber location.search
                  }
                , Cmd.none
                )

        ShowBookmarks ->
            ( model, newUrl "/" )

        ShowColophon ->
            ( model, newUrl "/colophon" )

        Nothing ->
            ( model, Cmd.none )
