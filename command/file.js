import { bot, delMsg, Commands, getCmd } from "../app.js"

export default new Commands(
    new RegExp(/^\/file/),
    "根据文件id获取文件",
    "file",
    true,
    async msg => {
        let file_id = getCmd(msg.text)[1]
        if (file_id === null || file_id === undefined || file_id === " " || file_id === "") {
            bot.sendMessage(msg.chat.id, "请输入“/file[空格][文件id]”格式的命令", {
                reply_to_message_id: msg.message_jd
            }).then(msg => {
                delMsg(msg.chat.id, msg.message_id)
            })
        } else {
            getFile(msg, file_id)
        }
    }

)
export function getFile(msg, file_id) {
    const data = file_id.split("&")
    if (data.length > 1) {
        switch (data[0]) {
            case "PH":
                bot.sendPhoto(msg.chat.id, data[1], {
                    reply_to_message_id: msg.message_id
                })
                break;
            case "DO":
                bot.sendDocument(msg.chat.id, data[1], {
                    reply_to_message_id: msg.message_id
                })
                break;
            case "VI":
                bot.sendVideo(msg.chat.id, data[1], {
                    reply_to_message_id: msg.message_id
                })
                break;
            case "VO":
                bot.sendVoice(msg.chat.id, data[1], {
                    reply_to_message_id: msg.message_id
                })
                break;
            case "AU":
                bot.sendAudio(msg.chat.id, data[1], {
                    reply_to_message_id: msg.message_id
                })
                break;
        }
    }
}