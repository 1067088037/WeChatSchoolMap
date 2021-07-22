const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  console.log(event)
  let tasks = []
  event.commentArray.forEach(async element => {
    console.log(element)
    const promise = db.collection('like').where({
      'super._id': element
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

  // console.log(result)
  let data = []
  let openid = wxContext.OPENID
  result.data.forEach(element => {
    data.push({
      superId: element.super._id,
      count: element.like.length,
      isLike: element.like.indexOf(openid) != -1
    })
  })
  return data
}