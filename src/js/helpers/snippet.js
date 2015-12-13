const snippetURL = `javascript:function bkmrk(){var a=document.createElement("script"),b=window.location,c=document.title,d="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/create?title="+c+"&url="+encodeURIComponent(b.href);try{/https/i.test(b.protocol)?window.open(d+"&action=close","_blank","width=100,height=100"):(document.title="Bookmarking "+c,a.setAttribute("src",d),a.setAttribute("async",""),document.body.appendChild(a),document.title=c)}catch(e){alert("Please wait until the page has loaded.")}}bkmrk();void 0;`

export default snippetURL
