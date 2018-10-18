/**
 * 小程序配置文件
 */
//接口域名
//var host = "http://127.0.0.1:4455";
var host = "https://tennismanage.dazonghetong.com";

var config = {
  host,
  baseUrl: `${host}`,
//   图片背景
  bg_img: `${host}/f/backgroundimage`,
  onShareAppMessageTitle :["我歌技了得，敢不敢一起合唱！", "歌已点好，快来与我合唱！"],
};

module.exports = config
