import mongoose, { Moongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error('Please define the MONGODB_URL environment variable inside .env.local');
}

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
        dbName: 'BookTalk-db',
        bufferCommands: false, 
        connectTimeoutMS: 30000
    })

    cached.conn = await cached.promise;
    return cached.conn;
}