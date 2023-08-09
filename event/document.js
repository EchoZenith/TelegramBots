import { bot, Events } from "../app.js";

export default new Events(
    "document",
    async msg => {
        bot.sendMessage(msg.chat.id, `\`DO&${msg.document.file_id}\``, {
            reply_to_message_id: msg.message_id,
            parse_mode:"Markdown"
        })
    }
)