const _db = wx.cloud.database()

export class Comment {
  /**
   * 绑定新评论列表
   * @param {string} superId 
   * @param {string} superType arch, point 等
   * @returns {string} comment-list ID
   */
  async bindNewCommentList(superId, superType) {
    return await _db.collection('comment-list').add({
      data: {
        super: {
          _id: superId,
          type: superType
        },
        list: []
      }
    }).then(res => res._id)
  }
}