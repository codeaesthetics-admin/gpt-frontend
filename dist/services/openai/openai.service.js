"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptAiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const fs = require('fs');
let ChatGptAiService = class ChatGptAiService {
    constructor() {
        this.OPENAI_API_KEY = process.env.OPEN_AI_KEY;
    }
    async generateText(latestPrompt, prompt, fileName) {
        try {
            await saveLogsInFile(fileName, `\n[Date/Time: ${new Date()}] \n[User query: ${prompt}]`);
            let initialResponse = await getQueryReview(prompt, this.OPENAI_API_KEY);
            await saveLogsInFile(fileName, `\n[Date/Time: ${new Date()}] \n[Security Bot Response : ${initialResponse.text}]`);
            if (initialResponse.text === 'NO'
                || initialResponse.text === 'NO.'
                || initialResponse.text.startsWith('No')
                || initialResponse.text.startsWith('NO.')) {
                return { role: "Assistant", text: process.env.UNAUTHORIZED_ENV_REPLY };
            }
            else {
                let middleResponse = await getRepReply(prompt, this.OPENAI_API_KEY);
                await saveLogsInFile(fileName, `\n[Date/Time: ${new Date()}] \n[Sales reply : ${middleResponse.text}]`);
                let finalResponse = await getReplyReview(prompt, middleResponse.text, this.OPENAI_API_KEY);
                if (finalResponse.text === 'UnSafe'
                    || finalResponse.text === 'UnSafe.'
                    || finalResponse.text.startsWith('UnSafe')
                    || finalResponse.text.startsWith('UnSafe.')) {
                    finalResponse.text = finalResponse.text.replace('UnSafe.', '');
                    finalResponse.text = finalResponse.text.replace('UnSafe.', '');
                    await saveLogsInFile(fileName, `\n[Date/Time: ${new Date()}] \n[Security Bot reply after reviewing sales rep : ${process.env.UNAUTHORIZED_ENV_REPLY}]`);
                    return { role: "Assistant", text: process.env.UNAUTHORIZED_ENV_REPLY };
                }
                else {
                    await saveLogsInFile(fileName, `\n[Date/Time: ${new Date()}] \n[Security Bot reply after reviewing sales rep : ${middleResponse.text}]`);
                    return middleResponse;
                }
            }
        }
        catch (err) {
            console.log(err.message);
            await saveLogsInFile(fileName, `\n[Date/Time: ${new Date()}] \n[Security Bot reply after reviewing sales rep : Something went wrong please try again!]`);
            return { role: "System", text: "Something went wrong please try again!" };
        }
    }
};
ChatGptAiService = __decorate([
    (0, common_1.Injectable)()
], ChatGptAiService);
exports.ChatGptAiService = ChatGptAiService;
let getQueryReview = async (userPrompt, key) => {
    let envPrompt = process.env.ENV_QUERY_REVIEW;
    let updatedPromt = `${envPrompt} Customer's question is: ${userPrompt}. Does this question comply with the ccompany's policy? `;
    let data = await openApiCall(key, updatedPromt);
    return data;
};
let getRepReply = async (repMessage, key) => {
    let envPrompt = process.env.ENV_REP_QUERY;
    let updatedPromt = `${envPrompt} Rep's message : ${repMessage} is the Rep's message safe based on the company policy? Answer with 'unsafe' if it isn't `;
    let data = await openApiCall(key, updatedPromt);
    return data;
};
let getReplyReview = async (customerMessage, middlePrompt, key) => {
    let envPrompt = process.env.ENV_REPLY_REVIEW;
    let updatedPromt = `${envPrompt} 
  ${process.env.SECOND_PRE_PROMPT_ENV_QUERY}
  Customer's message : ${customerMessage}  and sales rep response is: ${middlePrompt} `;
    let data = await openApiCall(key, updatedPromt);
    return data;
};
let openApiCall = async (key, updatedPromt) => {
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: updatedPromt }],
        temperature: 0
    };
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        }
    };
    const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', requestData, config);
    const choices = response.data.choices;
    let text = choices[0].message.content.trim();
    let role = choices[0].message.role;
    return { text, role };
};
let saveLogsInFile = async (fileName, content) => {
    let filePath = `./logs/${fileName}.txt`;
    if (fs.existsSync(filePath)) {
        const contents = fs.readFileSync(filePath, 'utf-8');
        if (contents.length > 0) {
            fs.appendFileSync(filePath, '\n' + content);
        }
        else {
            fs.appendFileSync(filePath, content);
        }
        console.log('File exists and new text has been appended.');
    }
    else {
        fs.writeFileSync(filePath, content);
        console.log('File does not exist and has been created with new text.');
    }
};
//# sourceMappingURL=openai.service.js.map