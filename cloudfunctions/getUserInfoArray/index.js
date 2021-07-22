const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  console.log(event)
  let tasks = []
  event._openidArray.forEach(async element => {
    console.log(element)
    const promise = db.collection('user').where({
      _openid: element
    }).get()
    tasks.push(promise)
  })

  // 等待所有
  let result = (await Promise.all(tasks)).reduce((acc, cur) => {
    console.log(cur)
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

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