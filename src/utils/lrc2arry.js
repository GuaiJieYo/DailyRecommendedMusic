function lrcToArry(lrc) {
  const lrcArry = lrc.trim().split("\n");
  const reg = /\[(.*?)\]|\((.*?)\)/g;
  let result = lrcArry.map((str) => {
    let matches = str.match(reg);
    if (matches) {
      let tag = convertTimeToSeconds(matches[0].slice(1, -1));
      let translation = matches[1] ? matches[1].trim().slice(1, -1) : ""; // 匹配到的翻译内容
      let content = str.replace(reg, "");
      return { tag, translation, content };
    } else {
      return { tag: "", content: str, contentcn: "" };
    }
  });
  return result;
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

export default lrcToArry;
