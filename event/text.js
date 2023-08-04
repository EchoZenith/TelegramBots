import { bot, Events, getName } from "../app.js";

export default new Events(
    "text",
    async msg => {
        console.log(msg.from.id, getName(msg.from), msg.text)
        const data = msg.text.split("&")
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
)