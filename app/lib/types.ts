export type UserLogin ={
    user:string;
    password:string;
}

export type SessionData={
    id:string,
    userId:string,
    perms:string[]
}