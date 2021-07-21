const path = require('path')
const qiniu = require('qiniu')
const console = require('console')
const { mac, formUploader, putExtra } = require('./base')
const { dependencies } = require('../../../src/package.json')

const fileName = `nodegit-v${dependencies['@derealize/nodegit']}-electron-v12.0-win32-x64.tar.gz`
const putPolicy = new qiniu.rs.PutPolicy({ scope: `derealize:${fileName}` })

formUploader.putFile(
  putPolicy.uploadToken(mac),
  fileName,
  path.join(__dirname, `../../../src/node_modules/@derealize/nodegit/build/stage/${fileName}`),
  putExtra,
  (respErr, respBody) => {
    if (respErr) {
      console.error(`putFile ${fileName}`, respErr)
      return
    }
    console.log(`putFile ${fileName} done.`, respBody)
  },
)
