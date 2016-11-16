module Store exposing (..)


type alias Model =
    { bookmarks : List Bookmark
    , selectedPage : Page
    }


type alias Bookmark =
    { id : String
    , title : String
    , url : String
    , createdAt : String
    }


type Msg
    = Nothing


type Page
    = Bookmarks
    | Colophon


initialModel : Model
initialModel =
    { bookmarks = [ { id = "1", title = "Test", url = "https://duckduckgo.com", createdAt = "2016-01-01" } ]
    , selectedPage = Bookmarks
    }
