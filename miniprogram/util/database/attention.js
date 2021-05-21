const _db = wx.cloud.database()
const cmd = _db.command

var hasInit = []

export class Attention {
  /**
   * 添加关注的标签
   * @param openid 
   * @param tag 既可以是string也可以是string的数组
   */
  async addTag(openid, tag) {
    await this.checkInit(openid)
    return await _db.collection('attention').doc(openid).update({
      data: {
        tag: cmd.addToSet({
          each: tag
        })
      }
    })
  }

  /**
   * 移除关注的标签
   * @param openid 
   * @param tag 既可以是string也可以是string的数组
   */
  async removeTag(openid, tag) {
    await this.checkInit(openid)
    return await _db.collection('attention').doc(openid).update({
      data: {
        tag: cmd.pull(tag)
      }
    })
  }

  /**
 * 添加关注的时间段
 * @param openid 
 * @param time 既可以是单个也可以是对象的数组
 */
  async addTime(openid, time) {
    await this.checkInit(openid)
    return await _db.collection('attention').doc(openid).update({
      data: {
        time: cmd.push(time)
      }
    })
  }

  /**
   * 移除关注的时间段
   * @param openid 
   * @param time 既可以是单个也可以是对象的数组
   */
  async removeTag(openid, time) {
    await this.checkInit(openid)
    return await _db.collection('attention').doc(openid).update({
      data: {
        time: cmd.pull(time)
      }
    })
  }

  /**
   * 获取关注的信息
   * @param openid 
   */
  async getAttention(openid) {
    await this.checkInit(openid)
    return await _db.collection('attention').doc(openid).get().then(res => res.data)
  }

  /**
   * 检查是否初始化 前端人员请勿调用
   * @param openid 
   */
  async checkInit(openid) {
    if (hasInit.indexOf(openid) != -1) {
      return true
    } else {
      hasInit.push(openid)
      return await _db.collection('attention').where({
        _id: openid
      }).count().then(async res => {
        if (res.total == 0) await _db.collection('attention').add({
          data: {
            _id: openid,
            tag: [],
            time: []
          }
        })
      })
    }
  }
}