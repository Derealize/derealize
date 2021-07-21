const path = require('path')
const qiniu = require('qiniu')
const console = require('console')
const { mac, formUploader, putExtra } = require('./base')

const putPolicy = new qiniu.rs.PutPolicy({ scope: 'derealize' })
const uploadToken = putPolicy.uploadToken(mac)

const fileName =
  process.platform === 'darwin'
    ? `Derealize-with-runtime-${process.env.npm_package_version}.dmg`
    : `Derealize-with-runtime-${process.env.npm_package_version}.exe`
const filePath = path.join(__dirname, `../../../release-with-runtime/${fileName}`)

formUploader.putFile(uploadToken, fileName, filePath, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error('putFile --with-runtime', respErr)
    return
  }
  console.log('putFile --with-runtime done.', respBody)

  const fileNameStatic = process.platform === 'darwin' ? `Derealize-with-runtime.dmg` : `Derealize-with-runtime.exe`
  const putPolicyStatic = new qiniu.rs.PutPolicy({ scope: `derealize:${fileNameStatic}` })
  const uploadTokenStatic = putPolicyStatic.uploadToken(mac)

  formUploader.putFile(uploadTokenStatic, fileNameStatic, filePath, putExtra, (respErr2, respBody2) => {
    if (respErr2) {
      console.error('putFile --static --with-runtime', respErr2)
      return
    }
    console.log('putFile --static --with-runtime done.', respBody2)
  })
})
