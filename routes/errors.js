export default function (app) {
  app.use((req, res) => {
    return res.status(404).render('404')
  })

  app.use((err, req, res, next) => {
    if (err) {
      console.error(err)

      return res.status(500).render('500')
    }
  })
}
