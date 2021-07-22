const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cmd = db.command
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  // 先取出集合记录总数
  const countResult = await db.collection('application').where({
    'super._id': event.superId,
    state: cmd.in(event.state)
  }).count()
  const total = countResult.total
  console.log('total = ', total)
  if (total == 0) return []

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('application').where({
      'super._id': event.superId,
      state: cmd.in(event.state)
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}