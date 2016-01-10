import createBrowserHistory from 'history/lib/createBrowserHistory'
import createMemoryHistory from 'history/lib/createMemoryHistory'

export default (typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory)
