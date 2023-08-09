import { bot, Events } from "../app.js";

export default new Events(
    "video",
    async msg => {
        bot.sendMessage(msg.chat.id, `\`VI&${msg.video.file_id}\``, {
            reply_to_message_id: msg.message_id,
            parse_mode: "Markdown"
        })
    }
)