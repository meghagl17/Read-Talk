import mongoose, { Moongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {
        conn: null, 
        promise: null,
    };
}

export const connect = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: 'bookTalk-db',
        bufferCommands: false, 
        connectTimeoutMS: 30000
    })

    cached.conn = await chached.promise;
    return cached.conn;
}