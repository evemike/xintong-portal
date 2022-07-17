/* 日期和时间的工具方法 */
// 日期格式化
export const dateFormate = (fmt: string, date: Date = new Date()) => {
  const o: { [key: string]: number } = {
    "Y+": date.getFullYear(),
    "y+": date.getFullYear(),
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  for (const k in o) {
    const ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1
          ? String(o[k])
          : String(o[k]).padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
};
