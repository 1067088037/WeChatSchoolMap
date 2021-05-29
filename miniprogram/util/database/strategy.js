import { db } from "./database"

const _db = wx.cloud.database()
const cmd = _db.command
const util = require('../util')

export class Strategy {
  /**
   * 添加攻略 仅仅用于首次添加
   * @param {string} superId 父级ID
   * @param {string} superType 父级类型 arch或campus
   * @param {object} strategy 策略 包括name，content; time会自动生成
   * content是Array，数组中每个对象包括name，楼层，位置，描述和图像数组
   * time是Object，包含首次创建时间fisrtCreate和最后修改时间lastEdit
   */
  async addStrategy(superId, superType, strategy) {
    console.warn('TODO:调用处没有修改')
    if (!db.perControl.limitTimeStrategy('addStrategy', 10000))
      return db.perControl.refusePromise()
    if (strategy.constructor != Object) {
      console.error('strategy类型非法')
    } else if (strategy.name.constructor != String) {
      console.error('name类型非法，需要String')
    } else if (strategy.content.constructor != Array) {
      console.error('content类型非法，需要Array')
    } else {
      let _id = util.randomId()
      await db.like.bindNewLike(_id, 'strategy', null)
      return _db.collection('strategy').add({
        data: {
          _id: _id,
          super: {
            _id: superId,
            type: superType
          },
          version: {
            editVersion: 1,
            createTime: _db.serverDate(),
            lastEditTime: _db.serverDate()
          },
          publish: {
            name: strategy.name,
            desc: strategy.desc,
            content: strategy.content,
          },
          draft: {
            name: strategy.name,
            desc: strategy.desc,
            content: strategy.content,
          },
          type: strategy.type
        }
      })
    }
  }

  /**
   * 获取攻略
   * @param {string} strategyId 攻略ID
   */
  async getStrategy(strategyId) {
    return await _db.collection('strategy').doc(strategyId).get().then(res => res.data).catch(err => null)
  }

  /**
   * 获取父级拥有的全部攻略的简要信息，不包含详情
   * @param {string} superId 
   */
  async getBriefStrategyArray(superId) {
    return wx.cloud.callFunction({
      name: 'getBriefStrategy',
      data: {
        superId: superId
      }
    }).then(res => res.result).catch(err => [])
  }
  /**
   * 获取用户拥有的全部攻略的简要信息，不包含详情
   * @param {string} openid 
   */
  async getBriefStrategyArrayByOpenid(openid) {
    return wx.cloud.callFunction({
      name: 'getBriefStrategyByOpenid',
      data: {
        _openid: openid
      }
    }).then(res => res.result).catch(err => [])
  }

  /**
   * 删除指定攻略
   * @param {string} strategyId 
   */
  async removeStrategy(strategyId) {
    console.warn('TODO:调用处没有修改')
    if (!db.perControl.limitTimeStrategy('removeStrategy', 1000))
      return db.perControl.refusePromise()
    // console.log(strategyId)
    await _db.collection('strategy').doc(strategyId).get().then(res => {
      // console.log(res.data)
      let draftContent = res.data.draft.content
      let publishContent = res.data.publish.content
      console.log(draftContent, publishContent)
      draftContent.forEach(element => {
        wx.cloud.deleteFile({
          fileList: element.images
        })
      });
      publishContent.forEach(element => {
        wx.cloud.deleteFile({
          fileList: element.images
        })
      });
    }).then(() => {
      // _db.collection('strategy').doc(strategyId).get().then(res => console.log(res))
      _db.collection('strategy').doc(strategyId).remove()
    }).catch(err => console.error(err))
    await _db.collection('like').where({
      'super._id': strategyId
    }).remove().catch(err => console.error(err))
    return db.comment.removeAllComment(strategyId).catch(err => console.error(err))
  }

  /**
   * 更新草稿攻略
   * @param {string} strategyId 
   * @param {object} data 
   */
  updateDraftStrategy(strategyId, draft) {
    return _db.collection('strategy').doc(strategyId).update({
      data: {
        "version.editVersion": cmd.inc(1),
        "version.lastEditTime": _db.serverDate(),
        draft: draft
      }
    })
  }

  /**
   * 将草稿内容发布
   * @param {string} strategyId 
   */
  async publishFromDraft(strategyId) {
    console.warn('TODO:调用处没有修改')
    if (!db.perControl.limitTimeStrategy('publishFromDraft', 3000))
      return db.perControl.refusePromise()
    const res = await _db.collection('strategy').doc(strategyId).get()
    return _db.collection('strategy').doc(strategyId).update({
      data: {
        publish: res.data.draft,
        type: "publish"
      }
    })
  }

}