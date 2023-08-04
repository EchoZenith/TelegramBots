import { bot, Commands } from "../app.js"
import { Config } from "../config.js"

export default new Commands(
    new RegExp(/^\/setchinese/),
    "设置中文语言包",
    "setchinese",
    true,
    async msg => {
        bot.sendMessage(msg.chat.id, "↓↓↓\n[点我安装中文语言包](https://t.me/setlanguage/classic-zh)", {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "设置中文语言包",
                        url: "https://t.me/setlanguage/classic-zh"
                    }, {
                        text: "意见反馈",
                        url: Config.tg_url
                    }]
                ]
            }
        })
    }
)