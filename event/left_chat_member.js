import { bot, Events, getName } from "../app.js";

export default new Events(
    "left_chat_member",
    async msg => {
        bot.sendMessage(msg.chat.id, `[${getName(msg.left_chat_member)}](tg://user?id=${msg.left_chat_member.id}) 一路走好`, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
        })
    }
)