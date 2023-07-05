const express = require('express')
const next = require('next')
const port = 3000
const dev = 'develop'
const app = next({ dev })
const handle = app.getRequestHandler()
const multer = require('multer')
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})
let uploader = multer({ storage: storage })
app.prepare()
  .then(() => {
    const server = express()
    server.get('/', (req, res) => {
      return app.render(req, res, '/index', req.query)
    })
    server.post(
      '/upload',
      uploader.single('fileInput'),
      (req, res) => {
        res.send('Test')
    })
    server.get('*', (req, res) => {
      return handle(req, res)
    })
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
})