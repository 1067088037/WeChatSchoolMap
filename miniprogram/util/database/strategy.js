import { db } from "./database"

const _db = wx.cloud.database()
const util = require('../util')

export class Strategy {
  /**
   * 添加攻略
   * @param {string} campusId 校区ID
   * @param {object} strategy 策略 包括name，content和time
   * content是Array，每个对象包括name，楼层，位置，描述和图像数组
   * time是Object，包含首次创建时间fisrtCreate和最后修改时间lastEdit
   */
  addStrategy(campusId, strategy) {
    if (strategy.constructor != Object) {
      console.error('strategy类型非法')
    } else if (strategy.name.constructor != String) {
      console.error('name类型非法，需要String')
    } else if (strategy.content.constructor != Array) {
      console.error('content类型非法，需要Array')
    } else if (strategy.time.constructor != Object) {
      console.error('time类型非法，需要Object')
    } else {
      let _id = util.randomId()
      _db.collection('strategy').add({
        data: {
          _id: _id,
          super: {
            _id: campusId,
            type: 'campus'
          },
          name: strategy.name,
          content: strategy.content,
          time: strategy.time
        }
      })
    }
  }

  /**
   * 删除指定攻略
   * @param {string} strategyId 
   */
  removeStrategy(strategyId) {
    _db.collection('strategy').doc(strategyId).remove()
    db.comment.removeAllComment(strategyId)
  }

  /**
   * 更新攻略
   * @param {string} strategyId 
   * @param {object} data 
   */
  updateStrategy(strategyId, data) {
    _db.collection('strategy').doc(strategyId).update({
      data: data
    })
  }
}