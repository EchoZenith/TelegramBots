import { bot, Events } from "../app.js";

export default new Events(
    "photo",
    async msg => {
        bot.sendMessage(msg.chat.id, `\`PH&${msg.photo[msg.photo.length - 1].file_id}\``, {
            reply_to_message_id: msg.message_id,
            parse_mode: "Markdown"
        })
    }
)