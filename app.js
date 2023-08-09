import TelegramBot from 'node-telegram-bot-api'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()
import { Config } from './config.js'

let TOKEN = ""
if (process.argv[2] && process.argv[2] === "--dev") {
	TOKEN = Config.token_dev
	console.log("running dev")
} else {
	TOKEN = Config.token
}

export const bot = new TelegramBot(TOKEN, {
	polling: true
})
bot.on('message', msg => {
	// console.log(msg)
})
loadCommands()
loadEvents()
async function loadEvents() {
	let i = 0
	// 循环查询event文件夹里的文件
	for (const vo of fs.readdirSync(__dirname + "/event")) {
		//判断是否是.js结尾
		if (path.extname(vo) === ".js") {
			// 判断是否是文件夹
			if (!fs.lstatSync(__dirname + "/event/" + vo).isDirectory()) {
				// 导入模块
				await import("./event/" + vo).then(module => {
					const event = module.default
					// 注册监听
					bot.on(event.event, event.fn)
					i++
					// 判断是否需要回调
					if (event.cb) {
						bot.on("callback_query", event.cb)
					}
				})
			}
		}
	}
	console.log(`注册事件成功 ${i}个`)
}
async function loadCommands() {
	const commands = []

	// 循环查询command文件夹里的文件
	for (const vo of fs.readdirSync(__dirname + "/command")) {
		//判断是否是.js结尾
		if (path.extname(vo) === ".js") {
			// 判断是否是文件夹
			if (!fs.lstatSync(__dirname + "/command/" + vo).isDirectory()) {
				// 导入模块
				await import("./command/" + vo).then(module => {
					const command = module.default
					// 注册监听
					bot.onText(command.reg, command.fn)
					// 判断是否要注册为菜单命令
					if (command.isCommands) {
						commands.push({
							description: command.descript,
							command: command.cmd
						})
					}
					// 判断是否需要回调
					if (command.cb) {
						bot.on("callback_query", command.cb)
					}
				})
			}
		}
	}
	bot.setMyCommands(commands).then(res => {
		console.log(`注册bot的菜单命令${res ? "成功" : "失败"} ${commands.length}个`)
	}).catch(err => {
		console.log("注册bot的菜单命令出错了", err.message)
	})
}
export function getName(chat_member) {
	let userName = chat_member.first_name
	if (chat_member.last_name) {
		userName += " " + chat_member.last_name
	}
	return userName
}
export function delMsg(chat_id, msg_id, time) {
	setTimeout(() => {
		bot.deleteMessage(chat_id, msg_id).catch(err => { })
	}, time || 60000)
}
export function isAdministrator(chat_id, user_id) {
	return bot.getChatAdministrators(chat_id).then(r => {
		for (let i = 0; i < r.length; i++) {
			if (r[i].user.id == user_id) {
				return true
			}
		}
		return false
	})
}
export class Commands {
	constructor(reg, descript, cmd, isCommands, fn, cb) {
		this.reg = reg
		this.descript = descript
		this.cmd = cmd
		this.isCommands = isCommands
		this.fn = fn
		this.cb = cb
	}
}
export class Events {
	constructor(event, fn, cb) {
		this.event = event
		this.fn = fn
		this.cb = cb
	}
}
export function getCmd(text) {
	const cmd = text.split(" ")
	const result = []
	for (let i = 0; i < cmd.length; i++) {
		if (cmd[i] != " " && cmd[i] != "") {
			result.push(cmd[i])
		}
	}
	return result
}