module Store exposing (..)

import Http exposing (..)
import Json.Decode exposing (..)
import Erl
import Navigation exposing (Location, newUrl)
import Router exposing (..)


type alias Model =
    { alert : ( String, String )
    , bookmarks : List Bookmark
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
    | ClearAlert
    | DeleteBookmark Int
    | FetchBookmarks
    | Navigate String
    | BookmarkFetchRequest (Result Http.Error (List Bookmark))
    | BookmarkSearchRequest (Result Http.Error (List Bookmark))
    | BookmarkDeleteRequest (Result Http.Error ())
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
        Http.send BookmarkFetchRequest request


searchBookmarks : String -> Cmd Msg
searchBookmarks searchTerm =
    let
        url =
            "/api/search?term=" ++ searchTerm

        request =
            Http.get url decodeBookmarks
    in
        Http.send BookmarkSearchRequest request


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
                , expect = expectStringResponse (\_ -> Ok ())
                , timeout = Maybe.Nothing
                , withCredentials = False
                }
    in
        Http.send BookmarkDeleteRequest request


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
    { alert = ( "", "" )
    , bookmarks = []
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

        ClearAlert ->
            ( { model | alert = ( "", "" ) }, Cmd.none )

        DeleteBookmark id ->
            ( model, deleteBookmark <| id )

        FetchBookmarks ->
            ( model, getBookmarks <| model.currentPageNumber )

        Navigate url ->
            ( model, newUrl url )

        BookmarkFetchRequest (Ok bookmarkList) ->
            ( { model | alert = ( "", "" ), bookmarks = bookmarkList }
            , Cmd.none
            )

        BookmarkFetchRequest (Err _) ->
            ( { model | alert = ( "error", "There was a problem fetching your bookmarks. Please try again." ) }
            , Cmd.none
            )

        BookmarkSearchRequest (Ok bookmarkList) ->
            ( { model | alert = ( "", "" ), searchResults = bookmarkList }
            , Cmd.none
            )

        BookmarkSearchRequest (Err _) ->
            ( { model | alert = ( "error", "There was a problem searching through your bookmarks. Please try again." ) }
            , Cmd.none
            )

        BookmarkDeleteRequest (Ok _) ->
            ( { model | alert = ( "", "" ) }
            , getBookmarks <| model.currentPageNumber
            )

        BookmarkDeleteRequest (Err _) ->
            ( { model | alert = ( "error", "There was a problem deleting that bookmark. Please try again." ) }
            , Cmd.none
            )

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
