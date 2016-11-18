module Store exposing (..)

import Http
import Json.Decode exposing (..)


type alias Model =
    { bookmarks : List Bookmark
    , selectedPage : Page
    }


type alias Bookmark =
    { id : Int
    , title : String
    , url : String
    , createdAt : String
    }


type Msg
    = Nothing
    | FetchBookmarks
    | NewBookmarks (Result Http.Error (List Bookmark))


type Page
    = Bookmarks
    | Colophon


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


initialModel : Model
initialModel =
    { bookmarks = []
    , selectedPage = Bookmarks
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

        Nothing ->
            ( model, Cmd.none )
