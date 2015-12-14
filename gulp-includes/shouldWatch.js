export default function evalWatch () {
  if ((process.env.NODE_ENV && process.env.NODE_ENV !== 'development') || process.argv[2] === 'dist') {
    return false
  }

  return true
}
