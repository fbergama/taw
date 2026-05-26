import http from 'http';
import {Message, APIReturnStatus, LoginData, AgentResponse } from './types';
import {Ollama} from 'ollama';

const host='backend';
const port=8080;


function build_options( host:string, port:number, path:string, method:string, auth:string|undefined, jwt:string|undefined ) {
  let options:http.RequestOptions = {
    hostname: host,
    port: port,
    path: path,
    method: method,
  }

  if( auth ) {
    options.auth = auth;
  }

  if( jwt ) {
    options.headers = {
    'Authorization': `Bearer ${jwt}`,
    'Accept': 'application/json' 
    }
  }

  return options;
}


async function make_request( options:http.RequestOptions, reqbody:object|undefined ) {

    return new Promise( (resolve, reject) => {

      let reqbodystring:string|undefined = undefined;
      
      if( reqbody ) {
        reqbodystring = JSON.stringify( reqbody );

        if( !options.headers )
          options.headers = {};

        options.headers["Content-Length"] = Buffer.byteLength(reqbodystring);
        options.headers["Content-Type"] = 'application/json';
      }


      const req = http.request(options, (res) => {
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
            resolve( parsedBody );
          } else {
            reject( parsedBody );
          }

        } catch (error) {
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
    if( reqbodystring ) {
      req.write( reqbodystring );
    }

    // 5. Send the request
    req.end();
  });
}




async function create_user_and_login( username:string, mail:string, password:string ):Promise<string> {

    let attempts = 5;
    while( --attempts>0 )
    try {
      console.log(`Registering new user: ${username}`)
      let data = await make_request(build_options(host, port, "/api/v3/users", "POST", undefined, undefined), {roles:[],username:username,password:password,mail:mail} );
      console.log(data);
    } catch( e ) {
      if( typeof e === "object" && e !== null  && "errormessage" in e ) {
        console.log( (e as APIReturnStatus).errormessage );
        attempts=0;
      } else {
        console.log("Connection error, retrying in 5 sec...")
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  

    console.log(`Logging in as ${username}`)
    let logindata = await make_request( build_options(host, port, "/api/v3/login", "GET", `${mail}:${password}`, undefined ), undefined ) as LoginData;
    console.log("Login ok!");
    return logindata.token;
}


async function get_last_messages(token:string):Promise<{messages:Message[], msgstring:string}> {

    let messages:Message[] = await make_request( build_options(host, port, "/api/v3/messages?skip=0&limit=10", "GET", undefined, token), undefined ) as Message[];

    let retstr = "";
    messages.forEach( (message) => {

      let tagstring = message.tags.reduce( (s,tag)=>{return `${s} #${tag} `}, "" ).trim();
      retstr += `[${message.authormail}] ${message.content} (${tagstring})\n`;

    });

    return {messages: messages, msgstring:retstr};
}


async function post_message( token:string, message:string, tags:string[] ):Promise<boolean> {

    let retval:APIReturnStatus = await make_request( build_options(host, port, "/api/v3/messages", "POST", undefined, token), {tags:tags, content:message} ) as APIReturnStatus;
    return retval.error;
  
}


const customOllama = new Ollama({ host: 'http://host.docker.internal:11434' });

async function chat_with_ollama( last_messages:string, user:string ):Promise<AgentResponse|undefined> {
  console.log('Thinking...');

  try {
    const response = await customOllama.chat({
      model: 'llama3', // Ensure you have this model pulled via `ollama run llama3`
      messages: [
        { role: 'system', content: 'Your task is to impersonate john, alice and bob who interact to an online message board application similar to twitter. Generate *short* realistic messages coherent with the provided history. The format is: [name] message content (#tag1 #tag2 ...). You can add at most 3 pertinent tags. Generate a single response without additional comments. Reply to users other than john, bob and alice with higher priority.' },
        { role: 'user', content: `Here are the last posted messages from newest to oldest. What should ${user} reply?\n\n${last_messages}` }
      ]
      // stream: false is the default here, so we get the whole response at once
    });

    console.log('\nOllama Response:');
    console.log(response.message.content);

    function removeLeadingLines(inputString: string): string {
        const lines = inputString.split('\n');
        const filteredLines = lines.filter(line => line.trim().startsWith('['));
        return filteredLines.join('\n');
    }

    const regex = /^\[([^\]]+)\]\s+([^(]+?)\s+\(([^)]+)\)$/;
    const match = removeLeadingLines(response.message.content).match(regex);
    if( match ) {
      console.log("Regex MATCH!");
      let tags = match[3].replaceAll("#","").split(" ").filter( (t)=>{ return t.length>0;} );
      //console.log("from: ", match[1]);
      //console.log("content: ", match[2]);
      console.log("tags: ", tags);
      return {content: match[2], tags: tags};
    }

    return undefined;

  } catch (error) {
    console.error('ollama error:', error);
  }
}


const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));


async function main() {

  const agents = [
    {username:"john",mail:"john@agent.com", password:"john", token:"" },
    {username:"bob",mail:"bob@agent.com", password:"bob", token:"" },
    {username:"alice",mail:"alice@agent.com", password:"alice", token:"" },
  ]

  try {

    for( let agent of agents ) {
      agent.token = await create_user_and_login( agent.username, agent.mail, agent.password );
    }

    //await post_message( agents[0].token, "hello everyone!", ["happy", "greetings"] );

    while( true ) {


      const messages = await get_last_messages(agents[0].token);
      if( messages.messages.length == 0 ) {
        console.log("No message yet.. waiting");
        await sleep( Math.random()*15000+5000 );
        continue;
      }
      //console.log("--------- last messages -------");
      //console.log(messages);
      //console.log("---------------------------------");

      console.log( messages.messages );

      let curr_agent = Math.floor(Math.random() * agents.length);
      if( messages.messages[0].authormail == agents[curr_agent].mail ) {
        curr_agent = (curr_agent + 1)%agents.length;
      }
      const agent_response = await chat_with_ollama(messages.msgstring, agents[curr_agent].username);

      if (agent_response) {
        await post_message(agents[curr_agent].token, agent_response.content, agent_response.tags);
        await sleep( Math.random()*15000+5000 );
      } else {
        console.log("Bad model response, trying again...")
      }

    }


  } catch( e ) {
    console.log("Error: ");
    console.log( e );
  }

}


main();