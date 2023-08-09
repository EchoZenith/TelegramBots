import { bot, delMsg, Events, getName, isAdministrator } from "../app.js";

export default new Events(
    "new_chat_members",
    async msg => {
        const option = getQuestion(msg)
        bot.restrictChatMember(msg.chat.id, msg.new_chat_member.id, {
            can_add_web_page_previews: false,
            can_send_messages: false,
            can_send_other_messages: false,
            can_send_documents: false,
            can_send_photos: false,
            can_send_videos: false,
            can_send_audios: false,
            until_date: 0
        })
        bot.sendMessage(msg.chat.id, option.text, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    option.keyboard,
                    [
                        {
                            text: "允许",
                            callback_data: "Administrator_question_allow"
                        },
                        {
                            text: "拒绝",
                            callback_data: "Administrator_question_refuse"
                        }
                    ]
                ]
            }
        }).then(msg => {
            delMsg(msg.chat.id, msg.message_id, 60000)
        })
    },
    async query => {
        const { data, message, from } = query
        if (data && typeof data === "string") {
            let cmd = data.split("_")
            if (cmd.length > 1) {
                switch (cmd[0]) {
                    case "Question":
                        if (message.reply_to_message.new_chat_member.id == from.id) {
                            if (+cmd[1] + +cmd[2] === +cmd[3]) {
                                bot.restrictChatMember(message.chat.id, message.reply_to_message.new_chat_member.id, {
                                    can_add_web_page_previews: true,
                                    can_send_messages: true,
                                    can_send_other_messages: true,
                                    can_send_documents: true,
                                    can_send_photos: true,
                                    can_send_videos: true,
                                    can_send_audios: true,
                                    until_date: 0
                                })
                                delMsg(message.chat.id, message.message_id, 10)
                            }
                        } else {
                            bot.answerCallbackQuery(query.id, {
                                text: "请不要乱点！！！"
                            })
                        }

                        break;
                    case "Administrator":
                        const isAdm = await isAdministrator(message.chat.id, from.id)
                        if (isAdm) {
                            if (cmd[1] == "question" && cmd[2] == "allow") {
                                bot.restrictChatMember(message.chat.id, message.reply_to_message.new_chat_member.id, {
                                    can_add_web_page_previews: true,
                                    can_send_messages: true,
                                    can_send_other_messages: true,
                                    can_send_documents: true,
                                    can_send_photos: true,
                                    can_send_videos: true,
                                    can_send_audios: true,
                                    until_date: 0
                                })
                                delMsg(message.chat.id, message.message_id, 10)
                            } else if (cmd[1] == "question" && cmd[2] == "refuse") {
                                bot.banChatMember(message.chat.id, message.reply_to_message.new_chat_member.id, {
                                    until_date: 0
                                })
                                delMsg(message.chat.id, message.message_id, 10)
                            }
                        } else {
                            bot.answerCallbackQuery(query.id, {
                                text: "请不要乱点！！！"
                            })
                        }
                        break;
                }
            }
        }
    }
)

function getQuestion(msg) {
    let option = {
        text: "",
        keyboard: []
    }
    const t = Math.floor(Math.random() * 4) // 正确答案的选项
    let t_left = Math.floor(Math.random() * 11) // 正确答案的左操作数
    let t_right = Math.floor(Math.random() * 11) // 正确答案的的右操作数
    for (let i = 0; i < 4; i++) {
        let left = Math.floor(Math.random() * 11)
        let right = Math.floor(Math.random() * 11)
        option.keyboard.push({
            text: left + right,
            callback_data: `Question_${left}_${right}_${t_left + t_right}`
        })
        if (i === t) {
            option.text = `[${getName(msg.new_chat_member)}](tg://user?id=${msg.new_chat_member.id}) 欢迎加入本群\n请在60秒内选择正确的答案\n${t_left} + ${t_right} = ?`
            option.keyboard[i].text = t_left + t_right
            option.keyboard[i].callback_data = `Question_${t_left}_${t_right}_${t_left + t_right}`
        }
    }
    return option
}