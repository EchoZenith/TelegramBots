import { Events } from "../app.js";
import { getFile } from "../command/file.js";

export default new Events(
    "text",
    async msg => {
        getFile(msg, msg.text)
    }
)