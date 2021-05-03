const db = wx.cloud.database()

export class Campus {
  async getCampus(id) {
    try {
      return await (await db.collection('campus').doc(id).get()).data
    } catch(e) {
      return null
    }
  }
}