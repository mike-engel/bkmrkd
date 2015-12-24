import createBrowserHistory from 'history/lib/createBrowserHistory'

export default (typeof window !== 'undefined' ? createBrowserHistory() : undefined)
