const fs = require('fs')
const path = require('path')

const list = [
  '/',
  '/archives/',
  '/about/',
]
const siteDir = path.resolve(__dirname, '../_site')
const swFile = path.resolve(__dirname, '../sw.js')
const urlsTemplate = /var urlsToCache = \[.*\]/

function fileDisplay(filePath) {
  const files = fs.readdirSync(filePath)

  files.forEach(function (filename) {
    const dir = path.join(filePath, filename)
    const stats = fs.statSync(dir)
    if (stats.isFile()) {
      list.push(dir.replace(siteDir, ''))
    }

    if (stats.isDirectory()) {
      fileDisplay(dir)
    }
  })
}

fileDisplay(siteDir)

const content = fs.readFileSync(swFile, 'utf-8')
fs.writeFileSync(swFile, content.replace(urlsTemplate, `var urlsToCache = ${JSON.stringify(list)}`))
