/**
 * 这个文件用于临时测试
 * 测试的发起者是 index.js 中的onShow()函数
 */

import { db } from "../../util/database/database";

export function launchTest() {
  // db.section.addSection('1ace8ef16090a631008f950170cb8165', {
  //   name: "测试社团",
  //   desc: "这个社团很好玩的",
  //   images: [],
  //   geo: db.Geo.Point(0, 0)
  // })

  // db.section.joinSection("cbddf0af609feb0a08bea6c82b6c3522")

  // db.section.exitSection('cbddf0af609feb0a08bea6c82b6c3522')

  // db.section.getUserInSection('cbddf0af609feb0a08bea6c82b6c3522').then(res => {
  //   console.log(res)
  // })

  // db.like.getIsAndCountLike(['scv4uf7gw1agp2n6lxhuo328bpkt31dk','ld86yr4r0mrs3r2cmcv8n0hloojkingh',['aaofcawodp8o650o75yr0wwyqutrj7gk']]).then(res => console.log(res))

  // db.strategy.addStrategy('1ace8ef160901b1b008f69ae08b0ee8a', 'campus', {
  //   name: '攻略',
  //   desc: '啦啦啦啦啦',
  //   content: [
  //     {
  //       name: '出发点',
  //       floor: 2,
  //       geo: db.Geo.Point(1, 1),
  //       desc: '来呀',
  //       images: ['']
  //     }
  //   ]
  // })

  // db.like.giveALike('4wenija2tt4k6uptqkv758rlluieyp2x')

  // db.like.countLike('4wenija2tt4k6uptqkv758rlluieyp2x').then(res => {
  //   console.log(res)
  // })

  // db.strategy.updateDraftStrategy('x2ix76c01ac9h5j8sk3ghb0bcdg0bplc', {
  //   name: '新新新攻略！！！',
  //   images: ['1']
  // })

  // db.strategy.publishFromDraft('x2ix76c01ac9h5j8sk3ghb0bcdg0bplc')

  // db.strategy.removeStrategy('thpy9sqvm4vcgbuftjwqvxvqnv92cx21')

  // db.strategy.getStrategy('yy6esdh8r98g0ogy03q6nm5kpb7r05j6').then(res => {
  //   console.log(res)
  // })

  // db.strategy.getBriefStrategyArray('1ace8ef160901b1b008f69ae08b0ee8a').then(res => {
  //   console.log(res)
  // })

  // db.strategy.getBriefStrategyArrayByOpenid(getApp().globalData.openid).then(res => {
  //   console.log(res)
  // })

  // db.global.clearUseless('like')

  // db.user.getUserUnderControl().then(res => {
  //   console.log(res)
  // })

  // db.attention.addTag('ojr_35JJZSWh0xHtk_0k9GRJ4TqQ', ['123','345'])
  // db.attention.getAttention('ojr_35JJZSWh0xHtk_0k9GRJ4TqQ')

  // db.campus.isAdmin('1ace8ef160901b1b008f69ae08b0ee8a', 'ojr_35JJZSWh0xHtk_0k9GRJ4TqQ').then(res => console.log(res))

  // db.section.addAdmin('cbddf0af609feb0a08bea6c82b6c3522', 'ojr_35JJZSWh0xHtk_0k9GRJ4TqQ')
}

export function dbExample() {
  // db.point.updatePointByMarkId(233, {
  //   tag: db.cmd.push('233'), //无条件插入数组
  //   tag: db.cmd.addToSet('233'), //在数组中没有该元素的情况下插入
  //   tag: db.cmd.pull('233'), //移除数组中指定元素
  // })

  // db.poster.addPoster('1ace8ef16090a631008f950170cb8165', {
  //   sender: getApp().globalData.openid,
  //   name: '哈哈哈新海报',
  //   desc: '快来玩呀',
  //   images: []
  // })

  // db.poster.getPosterBySchoolId('1ace8ef16090a631008f950170cb8165').then(res => {
  //   console.log(res)
  // })

  // db.section.getSectionArray('1ace8ef16090a631008f950170cb8165').then(res => console.log(res))

  // db.poster.getPosterByOpenid('ojr_35JzCl7EX1aJezpxwEgbjW_k').then(res => console.log(res))
}