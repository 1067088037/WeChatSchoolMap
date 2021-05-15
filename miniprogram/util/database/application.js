const _db = wx.cloud.database()

export class Application {
  /**
   * 新建申请表
   * @param {string} sectionId 
   * @param {object} section 包括 applicant，title，infrom，state 不要传入createTime
   */
  addApplication(sectionId, section) {
    if (section.applicant == null) {
      console.error('申请者不能为空')
    } else if (section.title == null) {
      console.error('标题不能为空')
    } else if (section.inform == null) {
      console.error('消息不能为空')
    } else if (section.state == null) {
      console.error('状态不能为空')
    } else {
      return _db.collection('application').add({
        super: {
          _id: sectionId,
          type: "section"
        },
        applicant: section.applicant,
        title: section.title,
        inform: section.inform,
        state: section.state,
        createTime: _db.serverDate()
      })
    }
  }
}