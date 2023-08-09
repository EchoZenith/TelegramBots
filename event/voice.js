import { bot, Events } from "../app.js";

export default new Events(
    "voice",
    async msg => {
        bot.sendMessage(msg.chat.id, `\`VO&${msg.voice.file_id}\``, {
            reply_to_message_id: msg.message_id,
            parse_mode: "Markdown"
        })
    }
)