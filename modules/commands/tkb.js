module.exports.config = {
  name: "tkb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Vtuan (customized)",
  description: "Gửi thời khóa biểu sáng và chiều bằng hình ảnh",
  commandCategory: "Utilities",
  usages: "",
  cooldowns: 2
};

module.exports.run = async ({ api, event, Users }) => {
  const request = require("request");
  const fs = require("fs");

  // Đường dẫn đến file JSON chứa danh sách ảnh thời khóa biểu
  const timetable = require('./../../img/tkb.json');
  var morningImage = timetable.morning[Math.floor(Math.random() * timetable.morning.length)].trim();
  var afternoonImage = timetable.afternoon[Math.floor(Math.random() * timetable.afternoon.length)].trim();

  function downloadAndSendImage(image, fileName, callback) {
    request(image).pipe(fs.createWriteStream(__dirname + `/` + fileName)).on("close", callback);
  }

  let callback = function () {
    return api.sendMessage({
      body: 'Thời khóa biểu của bạn đây!',
      attachment: [
        fs.createReadStream(__dirname + `/morning.png`), 
        fs.createReadStream(__dirname + `/afternoon.png`)
      ]
    }, event.threadID, () => {
      fs.unlinkSync(__dirname + `/morning.png`);
      fs.unlinkSync(__dirname + `/afternoon.png`);
    }, event.messageID);
  };

  downloadAndSendImage(morningImage, 'morning.png', () => {
    downloadAndSendImage(afternoonImage, 'afternoon.png', callback);
  });
};