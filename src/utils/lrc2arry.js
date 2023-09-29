/**
 * 歌词解析
 * @param {string} lrc 
 * @returns 数组对象
 */
export default function lrcToArry(lrc) {
  let lrcArry = [];
  // 将歌词分割成数组
  const Lrc = lrc.trim().split("\n");
  const reg = /\[.+?\]/g; // 匹配时间的正则表达式
  Lrc.forEach((str) => {
    let matchResult = str.match(reg);
    if (matchResult !== null) {
      let unConvertTime = matchResult[0]; // 匹配到的未转换的时间标签
      let character = str.replace(reg, ""); // 去掉时间标签后的歌词内容
      let ConvertTime = convertTimeToSeconds(unConvertTime.slice(1, -1)); // 将未转换的时间标签转换为秒数

      // 检查是否已存在相同时间的歌词行
      for (let i = 0; i < lrcArry.length; i++) {
        if (lrcArry[i].tag === ConvertTime) {
          // 如果已存在相同时间的歌词行，则更新翻译内容
          lrcArry[i].translation = character;
          return;
        }
      }

      // 将时间标签、歌词内容和翻译内容添加到结果数组中
      lrcArry.push({ tag: ConvertTime, content: character, translation: "" });
    }
  });
  // 将数组进行升序排列
  lrcArry.sort((a, b) => a.tag - b.tag);
  // 返回歌词数组
  return lrcArry;
}

// 转换时间格式
function convertTimeToSeconds(time) {
  const [minutes, secondsWithMilliseconds] = time.split(":");
  const [seconds, milliseconds] = secondsWithMilliseconds.split(".");

  const totalSeconds =
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10) +
    parseInt(milliseconds || "0", 10) / 1000;

  return totalSeconds.toFixed(2); // 保留两位精度
}
