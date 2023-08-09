import { bot, Events } from "../app.js";

export default new Events(
    "audio",
    async msg => {
        bot.sendMessage(msg.chat.id, `\`AU&${msg.audio.file_id}\``, {
            reply_to_message_id: msg.message_id,
            parse_mode: "Markdown"
        })
    }
)