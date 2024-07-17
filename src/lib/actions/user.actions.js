"use server"

import User from "../modals/user.modal"
import { connect } from "../db"

export async function createUser(user){
    try{
        await connect();
        const newUser = await User.create(user);
        console.log("in user.actions.js", JSON.stringify(newUser));
        return JSON.parse(JSON.stringify(newUser));
    } catch (error){
        console.log(error);
    }
}