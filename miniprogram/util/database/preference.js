import { db } from "./database"

const _db = wx.cloud.database()

let haveInit = false

export class Preference {
  currentOpenid() {
    return getApp().globalData.openid
  }

  /**
   * 获取偏好
   */
  async getPreference() {
    await this.checkInit()
    return _db.collection('preference').doc(this.currentOpenid()).get().then(res => res.data)
  }

  /**
   * 更新建筑项目
   * @param {object} archItems 
   */
  async updateArchItems(archItems) {
    if (!db.perControl.limitTimeStrategy('updateArchItems', 200))
      return db.perControl.refusePromise()
    await this.checkInit()
    let deepCopyArchItems = []
    archItems.forEach(e => deepCopyArchItems.push({
      value: e.value,
      selected: e.selected
    }))
    return _db.collection('preference').doc(this.currentOpenid()).update({
      data: {
        archItems: deepCopyArchItems
      }
    })
  }

  async checkInit() {
    if (haveInit) return true
    return await _db.collection('preference').doc(this.currentOpenid()).get().then(res => {
      haveInit = true
      return res
    }).catch(async () => {
      return await _db.collection('preference').add({
        data: {
          _id: this.currentOpenid(),
          archItems: []
        }
      })
      haveInit = true
    })
  }
}