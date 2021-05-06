const maxInteger = Math.pow(2, 53) - 1 //2的53次方减1

/** 
 * 生成随机的由字母数字组合的字符串
 */
export function randomWord(length) {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  var nums = ""
  for (var i = 0; i < length; i++) {
    var id = parseInt(Math.random() * 35)
    nums += chars[id]
  }
  return nums
}

/**
 * 生成随机32位id
 * @returns {string} 32位ID
 */
export function randomId() {
  return randomWord(32)
}

/**
 * @returns {number} 返回0~2^53-1中任意数字
 */
export function randomNumberId() {
  let id = parseInt(Math.random() * maxInteger)
  return id
}