module SearchResults exposing (..)

import Helpers exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Store exposing (..)


noSearchResults : Html Msg
noSearchResults =
    li [ class "bookmark bookmark--empty" ]
        [ text "There are no bookmarks with a title like that. Are you sure you spelled it right?" ]


searchResultsList : List Bookmark -> List (Html Msg)
searchResultsList searchResults =
    if List.length searchResults == 0 then
        [ noSearchResults ]
    else
        List.map bookmarkItem searchResults


view : Model -> Html Msg
view model =
    section [ class "bookmarks-list" ]
        [ ul [] (searchResultsList model.searchResults) ]
