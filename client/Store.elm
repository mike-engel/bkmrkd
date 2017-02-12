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
    , searchResults : List Bookmark
    , searchTerm : String
    , urlPrefix : String
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
    | Navigate String
    | NewBookmarks (Result Http.Error (List Bookmark))
    | NewSearchResults (Result Http.Error (List Bookmark))
    | OnLocationChange Location
    | SearchBookmarks
    | UpdateSearchTerm String
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


searchBookmarks : String -> Cmd Msg
searchBookmarks searchTerm =
    let
        url =
            "/api/search?term=" ++ searchTerm

        request =
            Http.get url decodeBookmarks
    in
        Http.send NewSearchResults request


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


initialModel : Route -> Location -> Model
initialModel currentPage location =
    { bookmarks = []
    , currentPage = currentPage
    , currentPageNumber = 1
    , searchResults = []
    , searchTerm = ""
    , urlPrefix = location.protocol ++ "//" ++ location.host
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangePageNumber newPage ->
            ( { model | currentPageNumber = newPage }
            , newUrl <| "/?page=" ++ (toString newPage)
            )

        DeleteBookmark id ->
            ( model, deleteBookmark <| id )

        FetchBookmarks ->
            ( model, getBookmarks <| model.currentPageNumber )

        Navigate url ->
            ( model, newUrl url )

        NewBookmarks (Ok bookmarkList) ->
            ( { model | bookmarks = bookmarkList }, Cmd.none )

        NewBookmarks (Err _) ->
            ( model, Cmd.none )

        NewSearchResults (Ok bookmarkList) ->
            ( { model | searchResults = bookmarkList }, Cmd.none )

        NewSearchResults (Err _) ->
            ( model, Cmd.none )

        OnLocationChange location ->
            let
                newRoute =
                    parseLocation location

                updatedModel =
                    { model
                        | currentPage = newRoute
                        , currentPageNumber = getUrlPageNumber location.search
                    }
            in
                case newRoute of
                    BookmarksRoute page ->
                        ( updatedModel
                        , getBookmarks <| Maybe.withDefault 1 page
                        )

                    ColophonRoute ->
                        ( updatedModel, Cmd.none )

                    SearchRoute term ->
                        ( updatedModel
                        , searchBookmarks <| Maybe.withDefault "" term
                        )

                    NotFoundRoute ->
                        ( updatedModel, Cmd.none )

        SearchBookmarks ->
            ( model, searchBookmarks <| model.searchTerm )

        UpdateSearchTerm term ->
            ( { model | searchTerm = term }, Cmd.none )

        Nothing ->
            ( model, Cmd.none )
