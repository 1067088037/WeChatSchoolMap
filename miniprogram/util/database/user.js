const _db = wx.cloud.database()
const cmd = _db.command

var debug = true

export class User {
  /**
   * 检查是否登录
   * @param {string} openid 
   */
  checkIsLogin() {
    let userInfo = getApp().globalData.userInfo.userInfo
    if (userInfo != undefined && Object.keys(userInfo).length >= 6) {
      // console.log('已登录')
      return true
    } else {
      wx.showModal({
        title: '没有登录',
        content: '部分功能需要登录才能查看。您还没有登录，请先登录',
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../../pages/myCenter/myCenter',
            })
          } else console.log('取消登录')
        }
      })
      return false
    }
  }

  /**
   * 调用云函数获取openid
   * @returns {string} openid
   */
  async getOpenId() {
    return await wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      if (debug) res.result.openid = '---' + res.result.openid
      return res
    }).catch(err => null)
  }

  /**
   * 根据openid数组获取用户信息，获取的是简化版信息
   * @param {array} openidArray 
   */
  async getUserInfoArray(openidArray) {
    return await wx.cloud.callFunction({
      name: 'getUserInfoArray',
      data: {
        _openidArray: Array.from(new Set(openidArray))
      }
    }).catch(err => [])
  }

  /**
   * 获取该用户有权控制的用户
   * @param {string} openid 默认传入此用户的ID
   */
  async getUserUnderControl(openid = getApp().globalData.openid) {
    return await wx.cloud.callFunction({
      name: 'getUserUnderControl',
      data: {
        _openid: openid
      }
    }).then(res => res.result).catch(err => [])
  }

  /**
   * 设置用户信息
   * @param {string} openid 
   * @param {object} userInfo 
   */
  async setUserInfo(openid, userInfo) {
    console.log(openid)
    if (userInfo.constructor != Object) {
      console.error('userInfo类型非法')
    } else {
      let count = await _db.collection('user').where({ _openid: openid }).count()
      if (count.total != 0) {
        return _db.collection('user').where({
          _openid: openid
        }).update({
          data: {
            userInfo: userInfo,
          }
        })
      } else {
        return _db.collection('user').add({
          data: {
            _id: openid,
            _openid: openid,
            userInfo: userInfo,
            info: {},
            point: [],
            favorite: []
          }
        })
      }
    }
  }

  /**
   * 设置信息
   * @param {object} info 学校和校区信息
   */
  setInfo(openid, info) {
    if (info.constructor != Object) {
      console.error('info类型非法')
    } else {
      return _db.collection('user').where({
        _openid: openid
      }).update({
        data: {
          info: info
        }
      })
    }
  }

  /**
   * 获取所有收藏
   * @param {string} openid 
   */
  async getFavorite(openid) {
    return await wx.cloud.callFunction({
      name: 'getItem',
      data: {
        collection: 'user',
        docid: openid,
        item: 'favorite'
      }
    }).then(res => res.result).catch(err => null)
  }

  /**
   * 添加收藏
   * @param {*} pointId 标点ID
   */
  async addFavorite(openid, pointId) {
    return await wx.cloud.callFunction({
      name: 'addInArray',
      data: {
        collection: 'user',
        docid: openid,
        array: 'favorite',
        push: pointId
      }
    }).catch(err => null)
  }

  /**
   * 删除指定收藏
   * @param {string} pointid 要删除的ID
   */
  async removeFavorite(openid, pointid) {
    return await wx.cloud.callFunction({
      name: 'removeInArray',
      data: {
        collection: 'user',
        docid: openid,
        array: 'favorite',
        remove: pointid
      }
    }).catch(err => null)
  }

  /**
   * 获取所有标点
   * @param {string} openid 
   */
  async getPoint(openid) {
    return await wx.cloud.callFunction({
      name: 'getItem',
      data: {
        collection: 'user',
        docid: openid,
        item: 'point'
      }
    }).then(res => res.result).catch(err => null)
  }

  /**
   * 添加标点
   * @param {*} pointid 标点ID
   */
  async addPoint(openid, pointid) {
    return await wx.cloud.callFunction({
      name: 'addInArray',
      data: {
        collection: 'user',
        docid: openid,
        array: 'point',
        push: pointid
      }
    }).catch(err => null)
  }

  /**
   * 删除指定标点
   * @param {string} pointid 要删除的ID
   */
  async removePoint(openid, pointid) {
    return await wx.cloud.callFunction({
      name: 'removeInArray',
      data: {
        collection: 'user',
        docid: openid,
        array: 'point',
        remove: pointid
      }
    }).catch(err => null)
  }

  /**
   * 通过openid获取用户
   * @param {string} openid 
   */
  async getUser(openid) {
    return await _db.collection('user').where({
      _openid: openid
    }).get().then(res => {
      if (res.data.length != 0) return res.data[0] //找到了用户信息
      else return null //没有找到
    }).catch(err => {
      wx.showToast({
        title: '网络异常',
        icon: 'error'
      })
    })
  }
}