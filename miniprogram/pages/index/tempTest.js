/**
 * 这个文件用于临时测试
 * 测试的发起者是 index.js 中的onShow()函数
 */

import { db } from "../../util/database/database";

export function launchTest() {
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

  db.strategy.getBriefStrategyArray('1ace8ef160901b1b008f69ae08b0ee8a').then(res => {
    console.log(res)
  })
}

export function dbExample() {

}