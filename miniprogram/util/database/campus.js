const _db = wx.cloud.database()

export class Campus {
  /**
   * 获取校区
   * @param {string} id 校区ID
   * @returns {object} 校区
   */
  async getCampus(id) {
    return await _db.collection('campus').doc(id).get().then(res => res.data).catch(err => null)
  }

  /**
   * 用户是否是校区的管理员
   * @param {string} campusId 
   * @param {string} openid 
   */
  async isAdmin(campusId, openid) {
    return this.getCampus(campusId).then(res => {
      return res.admin.indexOf(openid) != -1
    })
  }
}