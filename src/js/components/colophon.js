import React from 'react'
import snippet from '../helpers/snippet'

export default () => {
  return (
    <div className='colophon'>
      <h2 className='h2'>Colophon</h2>
      <p>bkmrkd was created by <a href='https://github.com/mike-engel'>Mike Engel</a> as an experiment in creating a service tied to a bookmarklet. Since then it's been rewritten in <a href='https://nodejs.org'>Node</a> and <a href='https://facebook.github.io/react/index.html'>React</a>. It's used as a playground for new web dev techniques such as isomorphic rendering, service worker, etc.</p>
      <p>To add bookmarks here, simply drag this <a href={snippet}>bookmarklet</a> to your bookmarks bar (or favorites bar or  whatever) and click it when you're on a page you want to bookmark.</p>
      <p>You can view the code on <a href='https://github.com/mike-engel/bkmrkd'>Github</a>, and file <a href='https://github.com/mike-engel/bkmrkd/issues'>issues</a> there too.</p>
    </div>
  )
}
