module Bookmarklet exposing (..)


bookmarkletCode : String -> String
bookmarkletCode urlPrefix =
    "javascript:function bkmrk(){var a=document.createElement('script'),b=window.location,c=document.title,d=" ++ urlPrefix ++ "/api/add?title='+c+'&url='+encodeURIComponent(b.href);try{/https/i.test(b.protocol)?window.open(d+'&action=close','_blank','width=100,height=100'):(document.title='Bookmarking '+c,a.setAttribute('src',d),a.setAttribute('async',''),document.body.appendChild(a),document.title=c)}catch(e){alert('Please wait until the page has loaded.')}}bkmrk();void 0;"
