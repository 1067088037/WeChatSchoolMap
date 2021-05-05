const _db = wx.cloud.database()

export class Comment {
  /**
   * 获取属于该父级的所有评论
   * @param {string} superId 父级ID
   * @returns {Array} 评论数组
   */
  async getAllComment(superId) {
    try {
      return await wx.cloud.callFunction({
        name: 'getAllBySuperId',
        data: {
          collection: 'comment',
          superId: superId
        }
      }).then(res => res.result.data)
    } catch (e) {
      return []
    }
  }

  /**
   * 删除以superId为父级的所有评论
   * @param {string} superId 父级id
   */
  async removeAllComment(superId) {
    _db.collection('comment').where({
      'super._id': superId
    }).remove()
  }

  /**
   * 插入评论
   * @param {string} superId 
   * @param {string} superType 
   * @param {object} comment 需要包含 reply,text,images
   */
  addComment(superId, superType, comment) {
    if (comment.constructor != Object) {
      console.error("comment类型非法")
    } else {
      _db.collection('comment').add({
        data: {
          super: {
            _id: superId,
            type: superType
          },
          time: _db.serverDate(),
          reply: comment.reply,
          text: comment.text,
          images: comment.images
        }
      })
    }
  }

  /**
   * 删除指定ID的评论
   * @param {string} commentId 
   */
  removeComment(commentId) {
    _db.collection('comment').doc(commentId).remove()
  }
}