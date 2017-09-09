module Bookmarklet exposing (..)

{-
   Here's the javascript syntax, unminified. When finished, plug it into google
   closure compiler or something to minify it. You'll want to make sure the string is prefixed by `javascript:`!

    function bkmrk () {
      var script = document.createElement('script')
      var location = window.location
      var title = document.title
      var apiUrl = '<URLHERE>/api/bookmarks/create?title=' + encodeURLComponent(title) + '&url=' + encodeURIComponent(location.href)

      try {
        document.title = 'Bookmarking ' + title

        script.setAttribute('src', apiUrl)
        script.setAttribute('async', '')

        document.body.appendChild(script)
        document.title = title
      } catch (err) {
        alert('Something went wrong. Make sure the page is fully loaded.')
      }
    }

    bkmrk()
    void(0)

   e.g., here's the output as a full string.

   function bkmrk(){var a=document.createElement('script'),b=document.title,c='<URLHERE>/api/bookmarks/create?title='+b+'&url='+encodeURIComponent(window.location.href);try{document.title='Bookmarking '+b,a.setAttribute('src',c),a.setAttribute('async',''),document.body.appendChild(a),document.title=b}catch(d){alert('Something went wrong. Make sure the page is fully loaded.')}}bkmrk();void 0;
-}


bookmarkletCode : String -> String
bookmarkletCode urlPrefix =
    "javascript:function bkmrk(){var a=document.createElement('script'),b=document.title,c='" ++ urlPrefix ++ "/api/bookmarks/create?title='+encodeURIComponent(b)+'&url='+encodeURIComponent(window.location.href);try{document.title='Bookmarking '+b,a.setAttribute('src',c),a.setAttribute('async',''),document.body.appendChild(a),document.title=b}catch(d){alert('Something went wrong. Make sure the page is fully loaded.')}}bkmrk();void 0;"
