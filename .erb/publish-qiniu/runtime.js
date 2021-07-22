const path = require('path')
const qiniu = require('qiniu')
const console = require('console')
const { mac, formUploader, putExtra } = require('./base')

const isDarwin = process.platform === 'darwin'
const filePath = path.join(__dirname, `../../release-with-runtime/${fileName}`)

const fileName = `Derealize-with-runtime-${process.env.npm_package_version}.${isDarwin ? 'dmg' : 'exe'}`
const putPolicy = new qiniu.rs.PutPolicy({ scope: 'derealize' })
const uploadToken = putPolicy.uploadToken(mac)

formUploader.putFile(uploadToken, fileName, filePath, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error(`putFile ${fileName} error`, respErr)
    return
  }
  console.log(`putFile ${fileName} done.`, respBody)
})

const fileNameStatic = `Derealize-with-runtime.${isDarwin ? 'dmg' : 'exe'}`
const putPolicyStatic = new qiniu.rs.PutPolicy({ scope: `derealize:${fileNameStatic}` })
const uploadTokenStatic = putPolicyStatic.uploadToken(mac)

formUploader.putFile(uploadTokenStatic, fileNameStatic, filePath, putExtra, (respErr2, respBody2) => {
  if (respErr2) {
    console.error(`putFile ${fileNameStatic} error`, respErr2)
    return
  }
  console.log(`putFile ${fileNameStatic} done.`, respBody2)
})
