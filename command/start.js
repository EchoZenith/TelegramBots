import { bot, Commands } from "../app.js"
import { Config } from "../config.js"

export default new Commands(
    new RegExp(/^\/start/),
    "开始命令",
    "start",
    false,
    async msg => {
        bot.sendMessage(msg.chat.id, "hello 欢迎使用本机器人", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "意见反馈",
                            url: Config.tg_url
                        }
                    ]
                ]
            }
        })

    }
)