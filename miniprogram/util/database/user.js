const _db = wx.cloud.database()
const cmd = _db.command

export class User {
  /**
   * 调用云函数获取openid
   */
  async getOpenId() {
    try {
      return await wx.cloud.callFunction({
        name: 'login'
      })
    } catch (err) {
      return null
    }
  }

  /**
   * 设置用户信息
   * @param {string} openid 
   * @param {object} userInfo 
   */
  setUserInfo(openid, userInfo) {
    _db.collection('user').doc(openid).get().then(res => {
      _db.collection('user').doc(openid).update({
        data: {
          userInfo: userInfo,
        }
      })
    }).catch(e => {
      _db.collection('user').add({
        data: {
          _id: openid,
          userInfo: userInfo,
          info: {},
          point: [],
          favorite: []
        }
      })
    })
  }

  /**
   * 设置信息
   * @param {object} info 学校和校区信息
   */
  setInfo(openid, info) {
    return _db.collection('user').doc(openid).update({
      data: {
        info: info
      }
    })
  }

  /**
   * 获取所有收藏
   * @param {string} openid 
   */
  async getFavorite(openid) {
    try {
      return await wx.cloud.callFunction({
        name: 'getItem',
        data: {
          collection: 'user',
          docid: openid,
          item: 'favorite'
        }
      }).then(res => res.result)
    } catch (e) {
      return null
    }
  }

  /**
   * 添加收藏
   * @param {*} pointid 标点ID
   */
  async addFavorite(openid, pointid) {
    try {
      return await wx.cloud.callFunction({
        name: 'addInArray',
        data: {
          collection: 'user',
          docid: openid,
          array: 'favorite',
          push: pointid
        }
      })
    } catch (e) {
      return null
    }
  }

  /**
   * 删除指定收藏
   * @param {string} pointid 要删除的ID
   */
  async removeFavorite(openid, pointid) {
    try {
      return await wx.cloud.callFunction({
        name: 'removeInArray',
        data: {
          collection: 'user',
          docid: openid,
          array: 'favorite',
          remove: pointid
        }
      })
    } catch (e) {
      return null
    }
  }

  /**
   * 获取所有标点
   * @param {string} openid 
   */
  async getPoint(openid) {
    try {
      return await wx.cloud.callFunction({
        name: 'getItem',
        data: {
          collection: 'user',
          docid: openid,
          item: 'point'
        }
      }).then(res => res.result)
    } catch (e) {
      return null
    }
  }

  /**
   * 添加标点
   * @param {*} pointid 标点ID
   */
  async addPoint(openid, pointid) {
    try {
      return await wx.cloud.callFunction({
        name: 'addInArray',
        data: {
          collection: 'user',
          docid: openid,
          array: 'point',
          push: pointid
        }
      })
    } catch (e) {
      return null
    }
  }

  /**
   * 删除指定标点
   * @param {string} pointid 要删除的ID
   */
  async removePoint(openid, pointid) {
    try {
      return await wx.cloud.callFunction({
        name: 'removeInArray',
        data: {
          collection: 'user',
          docid: openid,
          array: 'point',
          remove: pointid
        }
      })
    } catch (e) {
      return null
    }
  }

  /**
   * 通过openid获取用户
   * @param {string} openid 
   */
  async getUser(openid) {
    try {
      return await (await _db.collection('user').doc(openid).get()).data
    } catch (e) {
      return null
    }
  }
}