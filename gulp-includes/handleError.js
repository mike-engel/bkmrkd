export default function handleError (err) {
  if (err) {
    console.error(`Error during the gulp build: ${err}`)
    process.exit(1)
  }
}
