module Store exposing (..)


type alias Model =
    { selectedPage : Page }


type Msg
    = Nothing


type Page
    = Bookmarks
    | Colophon


initialModel : Model
initialModel =
    { selectedPage = Bookmarks }
