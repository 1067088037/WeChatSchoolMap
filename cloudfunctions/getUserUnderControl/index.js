const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cmd = db.command
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  let thisUser = await (await db.collection('user').doc(event._openid).get()).data
  let permission = thisUser.info.permission

  switch (permission) {
    case 0: return [] //黑名单
    case 16: return [] //访客
    case 32: return [] //学生
    case 48: return[] //编辑
    case 64: //部门管理员
      const where = db.collection('user').where({
        'info.permission': cmd.lt(permission), //查询的必须是权限更低的用户
        'info.section': null //todo
      })
      break
    case 80: //校区管理员
      
      break
    case 96: //学校管理员
      
      break
    case 112: //管理员
      
      break
    case 128: //超级管理员
      
      break
  }
  // 先取出集合记录总数
  const countResult = where.count()
  const total = countResult.total

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = where.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  let res = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  let data = res.data

  data.forEach(element => {

  })
}