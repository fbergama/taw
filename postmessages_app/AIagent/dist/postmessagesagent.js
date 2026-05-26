"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const ollama_1 = require("ollama");
const host = 'backend';
const port = 8080;
function build_options(host, port, path, method, auth, jwt) {
    let options = {
        hostname: host,
        port: port,
        path: path,
        method: method,
    };
    if (auth) {
        options.auth = auth;
    }
    if (jwt) {
        options.headers = {
            'Authorization': `Bearer ${jwt}`,
            'Accept': 'application/json'
        };
    }
    return options;
}
async function make_request(options, reqbody) {
    return new Promise((resolve, reject) => {
        let reqbodystring = undefined;
        if (reqbody) {
            reqbodystring = JSON.stringify(reqbody);
            if (!options.headers)
                options.headers = {};
            options.headers["Content-Length"] = Buffer.byteLength(reqbodystring);
            options.headers["Content-Type"] = 'application/json';
        }
        const req = http_1.default.request(options, (res) => {
            let rawData = '';
            // 1. Listen for data chunks and assemble them
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            // 2. Once the stream ends, parse the complete body
            res.on('end', () => {
                try {
                    // Assuming you expect a JSON response (even for errors)
                    const parsedBody = JSON.parse(rawData);
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsedBody);
                    }
                    else {
                        reject(parsedBody);
                    }
                }
                catch (error) {
                    console.log('Error: Response was not JSON. Raw text:', rawData);
                    reject(undefined);
                }
            });
        });
        // 3. Handle network-level errors (e.g., DNS resolution failed, connection refused)
        req.on('error', (error) => {
            console.error(`Network Error: ${error.message}`);
            reject(undefined);
        });
        // 4. Send request body (if any)
        if (reqbodystring) {
            req.write(reqbodystring);
        }
        // 5. Send the request
        req.end();
    });
}
async function create_user_and_login(username, mail, password) {
    let attempts = 5;
    while (--attempts > 0)
        try {
            console.log(`Registering new user: ${username}`);
            let data = await make_request(build_options(host, port, "/api/v3/users", "POST", undefined, undefined), { roles: [], username: username, password: password, mail: mail });
            console.log(data);
        }
        catch (e) {
            if (typeof e === "object" && e !== null && "errormessage" in e) {
                console.log(e.errormessage);
            }
            else {
                console.log("Connection error, retrying in 5 sec...");
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    console.log(`Logging in as ${username}`);
    let logindata = await make_request(build_options(host, port, "/api/v3/login", "GET", `${mail}:${password}`, undefined), undefined);
    console.log("Login ok!");
    return logindata.token;
}
async function get_last_messages(token) {
    let messages = await make_request(build_options(host, port, "/api/v3/messages?skip=0&limit=5", "GET", undefined, token), undefined);
    let retstr = "";
    messages.forEach((message) => {
        let tagstring = message.tags.reduce((s, tag) => { return `${s} #${tag} `; }, "").trim();
        retstr += `[${message.authormail}] ${message.content} (${tagstring})\n`;
    });
    return retstr;
}
async function post_message(token, message, tags) {
    let retval = await make_request(build_options(host, port, "/api/v3/messages", "POST", undefined, token), { tags: tags, content: message });
    return retval.error;
}
const customOllama = new ollama_1.Ollama({ host: 'http://host.docker.internal:11434' });
async function chat_with_ollama(last_messages, user) {
    console.log('Thinking...');
    try {
        const response = await customOllama.chat({
            model: 'llama3',
            messages: [
                { role: 'system', content: 'Your task is to impersonate john, alice and bob who interact to an online message board application similar to twitter. Generate *short* realistic messages coherent with the provided history. The format is: [name] message content (#tag1 #tag2 ...). You can add at most 3 pertinent tags. Generate a single response without additional comments. Reply to users other than john, bob and alice with higher priority.' },
                { role: 'user', content: `Here are the last 5 messages. What should ${user} reply?\n\n${last_messages}` }
            ]
            // stream: false is the default here, so we get the whole response at once
        });
        console.log('\nOllama Response:');
        console.log(response.message.content);
        function removeLeadingLines(inputString) {
            const lines = inputString.split('\n');
            const filteredLines = lines.filter(line => line.trim().startsWith('['));
            return filteredLines.join('\n');
        }
        const regex = /^\[([^\]]+)\]\s+([^(]+?)\s+\(([^)]+)\)$/;
        const match = removeLeadingLines(response.message.content).match(regex);
        if (match) {
            console.log("Regex MATCH!");
            let tags = match[3].replaceAll("#", "").split(" ").filter((t) => { return t.length > 0; });
            //console.log("from: ", match[1]);
            //console.log("content: ", match[2]);
            console.log("tags: ", tags);
            return { content: match[2], tags: tags };
        }
        return undefined;
    }
    catch (error) {
        console.error('ollama error:', error);
    }
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function main() {
    const agents = [
        { username: "john", mail: "john@agent.com", password: "john", token: "" },
        { username: "bob", mail: "bob@agent.com", password: "bob", token: "" },
        { username: "alice", mail: "alice@agent.com", password: "alice", token: "" },
    ];
    try {
        for (let agent of agents) {
            agent.token = await create_user_and_login(agent.username, agent.mail, agent.password);
        }
        //await post_message( agents[0].token, "hello everyone!", ["happy", "greetings"] );
        while (true) {
            let curr_agent = Math.floor(Math.random() * agents.length);
            const messages = await get_last_messages(agents[curr_agent].token);
            console.log("--------- last 5 messages -------");
            console.log(messages);
            console.log("---------------------------------");
            const agent_response = await chat_with_ollama(messages, agents[curr_agent].username);
            if (agent_response) {
                await post_message(agents[curr_agent].token, agent_response.content, agent_response.tags);
                await sleep(Math.random() * 15000 + 5000);
            }
            else {
                console.log("Bad model response, trying again...");
            }
        }
    }
    catch (e) {
        console.log("Error: ");
        console.log(e);
    }
}
main();
