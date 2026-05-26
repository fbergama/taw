
export interface LoginData {
  error:boolean,
  errormessage:string,
  token:string
}

export interface Message {
  content:string,
  timestamp:Date,
  authormail:string,
  tags:string[]
}

export interface APIReturnStatus {
  statuscode:number,
  error:boolean,
  errormessage:string
}

export interface AgentResponse {
    content:string,
    tags:string[]
}