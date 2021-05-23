const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  // 先取出集合记录总数
  const countResult = await db.collection('user').where({
    'info.section.join': event.sectionId
  }).count()
  const total = countResult.total
  console.log(total)
  if (total == 0) return []

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('user').where({
      'info.section.join': event.sectionId
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  let res = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  let result = []
  res.data.forEach(element => {
    result.push({
      _openid: element._openid,
      permission: element.info.permission,
      nickName: element.userInfo.nickName,
      avatarUrl: element.userInfo.avatarUrl
    })
  })

  return result
}