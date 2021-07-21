const path = require('path')
const qiniu = require('qiniu')
const console = require('console')
const { mac, formUploader, putExtra } = require('./base')

const fileName = 'latest.json'
const putPolicy = new qiniu.rs.PutPolicy({ scope: `derealize:${fileName}` })

formUploader.putFile(
  putPolicy.uploadToken(mac),
  fileName,
  path.join(__dirname, `../${fileName}`),
  putExtra,
  (respErr, respBody) => {
    if (respErr) {
      console.error(`putFile ${fileName}`, respErr)
      return
    }
    console.log(`putFile ${fileName} done.`, respBody)
  },
)
