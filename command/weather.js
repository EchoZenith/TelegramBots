import { bot, delMsg, Commands, getCmd } from "../app.js"
import { Config } from "../config.js"
import axios from 'axios'
import url from 'url'
const KEY = Config.key //和风天气key

export default new Commands(
    new RegExp(/^\/weather/),
    "天气查询",
    "weather",
    true,
    async msg => {
        let local = getCmd(msg.text)[1]
        if (local === null || local === undefined || local === " " || local === "") {
            bot.sendMessage(msg.chat.id, "请输入“/weather[空格][城市名]”格式的命令", {
                reply_to_message_id: msg.message_jd
            }).then(msg => {
                delMsg(msg.chat.id, msg.message_id)
            })
        } else {
            weather(local, msg.chat.id)
        }
    },
    async query => {
        const { data, message } = query
        if (data && typeof data === "string") {
            let cmd = data.split("_")
            if (cmd.length > 1) {
                switch (cmd[0]) {
                    case "weather":
                        let weather = await getWeather(cmd[1])

                        bot.sendMessage(message.chat.id, `
							${cmd[2]}:\n
							天气:${weather.text}\n
							温度:${weather.temp}℃\n
							体感:${weather.feelsLike}℃\n
							湿度:${weather.humidity}%\n
							风向:${weather.windDir} ${weather.windScale}级
						`).then(msg => {
                            delMsg(msg.chat.id, msg.message_id)
                        })
                        bot.deleteMessage(message.chat.id, message.message_id)
                        break;
                }
            }
        }
    }
)

function findLocationId(text) {
    const api = new url.URL('https://geoapi.qweather.com/v2/city/lookup')
    api.searchParams.append('key', KEY)
    api.searchParams.append('location', text)

    return axios.get(api.href)
        .then(res => {
            if (res.data.code === '200') {
                return res.data.location
            } else {
                return null
            }
        })
        .catch(err => {
            console.log(err)
            return null
        })
}

function getWeather(location) {
    const api = new url.URL('https://devapi.qweather.com/v7/weather/now')
    api.searchParams.append('key', KEY)
    api.searchParams.append('location', location)

    return axios.get(api.href)
        .then(res => {
            if (res.data.code === '200') {
                return res.data.now
            } else {
                return null
            }
        })
        .catch(err => {
            console.log(err)
            return null
        })
}

async function weather(text, id) {
    let list = await findLocationId(text)
    if (list) {
        if (list.length > 1) {

            let inline_keyboard = []
            let row = []
            for (let i = 0; i < list.length; i++) {
                row.push({
                    text: list[i].adm1 + list[i].adm2 + list[i].name,
                    callback_data: "weather_" + list[i].id + `_${list[i].name}`
                })
                if (row.length === 2 || i === list.length - 1) {
                    inline_keyboard.push(row)
                    row = []
                }
            }
            bot.sendMessage(id, "请选择：", {
                reply_markup: {
                    inline_keyboard
                }
            })

        } else {
            let weather = await getWeather(list[0].id)
            bot.sendMessage(id, `
				${list[0].name}:\n
				天气:${weather.text}\n
				温度:${weather.temp}℃\n
				体感:${weather.feelsLike}℃\n
				湿度:${weather.humidity}%\n
				风向:${weather.windDir} ${weather.windScale}级
			`).then(msg => {
                delMsg(msg.chat.id, msg.message_id)
            })
        }
    } else {
        bot.sendMessage(id, "抱歉，没有找到这个地址").then(msg => {
            delMsg(msg.chat.id, msg.message_id)
        })
    }
}