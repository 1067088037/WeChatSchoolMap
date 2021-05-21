const _db = wx.cloud.database()

export class Application {
  /**
   * 通过部门ID获取申请表
   * @param {string} sectionId 部门ID
   * @param {Array} state 查询的状态 查询全部填空数组[]
   */
  async getApplicationBySectionId(sectionId, state = []) {
    if (state.constructor != Array) {
      console.error('state类型非法 要求传入数组')
    } else {
      return await wx.cloud.callFunction({
        name: 'getApplicationBySectionId',
        data: {
          superId: sectionId,
          state: state
        }
      }).then(res => res.result).catch(err => [])
    }
  }

  /**
   * 通过申请者的openid获取申请表
   * @param {string} openid 用户开放ID
   * @param {Array} state 查询的状态 查询全部填空数组[]
   */
  async getApplicationByApplicant(openid, state = []) {
    if (state.constructor != Array) {
      console.error('state类型非法 要求传入数组')
    } else {
      return await wx.cloud.callFunction({
        name: 'getApplicationByApplicant',
        data: {
          openid: openid,
          state: state
        }
      }).then(res => res.result).catch(err => [])
    }
  }

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
        data: {
          super: {
            _id: sectionId,
            type: "section"
          },
          applicant: section.applicant,
          title: section.title,
          inform: section.inform,
          state: section.state,
          createTime: _db.serverDate()
        }
      })
    }
  }

  /**
   * 删除申请表
   * @param {string} applicationId 申请表ID
   */
  removeApplication(applicationId) {
    _db.collection('application').doc(applicationId).remove()
  }

  /**
   * 更新申请表
   * @param {string} applicationId 
   * @param {object} application 
   */
  updateApplication(applicationId, application) {
    _db.collection('application').doc(applicationId).update({
      data: application
    })
  }
}