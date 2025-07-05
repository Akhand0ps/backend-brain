import mongoose, { Model } from "mongoose";
import { Schema } from "zod";


const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }

});


export const UserModel = mongoose.model("User",UserSchema);


const ContentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    tags:[{
        type:mongoose.Types.ObjectId,ref:'Tag'
    }],

    type:String,
    userId:[{
        type:mongoose.Types.ObjectId,ref:'User',
        required:true
    }]
})

export const ContentModel = mongoose.model("Content",ContentSchema);

const LinkSchema = new mongoose.Schema({
    hash:String,
    userId:{
        type:mongoose.Types.ObjectId,ref:'User',
        required:true,
        unique:true
    }
});

export const LinkModel = mongoose.model("Links",LinkSchema);