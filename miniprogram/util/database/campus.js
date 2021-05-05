const _db = wx.cloud.database()

export class Campus {
  /**
   * 获取校区
   * @param {string} id 校区ID
   * @returns {object} 校区
   */
  async getCampus(id) {
    try {
      return await (await _db.collection('campus').doc(id).get()).data
    } catch(e) {
      return null
    }
  }
}