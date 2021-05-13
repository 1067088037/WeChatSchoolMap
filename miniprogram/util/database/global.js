const _db = wx.cloud.database()

export class Global {
  /**
   * 清理无用的数据库记录，具体指父级已经删除的记录
   * @param {string} clearCollection 要清理的集合
   * @param {boolean} clearNoSuper 是否清理根本没有父级的记录 请谨慎填写true，否则可能造成不可逆的影响！！！
   */
  clearUseless(clearCollection, clearNoSuper = false) {
    wx.cloud.callFunction({
      name: 'clearUseless',
      data: {
        clearCollection: clearCollection,
        clearNoSuper: clearNoSuper
      }
    })
  }
}