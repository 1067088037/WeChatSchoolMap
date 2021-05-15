const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cmd = db.command
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  let result = []
  await event._openidArray.forEach(async element => {
    db.collection('user').where({
      _openid: element
    }).get().then(res => {
      result.push(res)
      console.log(result)
    })
  })

  console.log(result)
  return

  let data = []
  result.data.forEach(element => {
    data.push({
      _openid: element._openid,
      avatarUrl: element.userInfo.avatarUrl,
      nickName: element.userInfo.nickName
    })
  })

  return data
}