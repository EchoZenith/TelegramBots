import { bot, Events, getName } from "../app.js";

export default new Events(
    "new_chat_members",
    async msg => {
        bot.sendMessage(msg.chat.id, `[${getName(msg.new_chat_member)}](tg://user?id=${msg.new_chat_member.id}) 欢迎加入本群`, {
            parse_mode: "Markdown",
            disable_web_page_preview: true
        })
    }
)