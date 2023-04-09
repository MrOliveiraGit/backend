import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User{
    @Prop()
    id: number
    @Prop()
    firstName:string
    @Prop()
    lastName:string
    @Prop()
    email:string
    @Prop()
    avatar:string
}


export const UserSchema = SchemaFactory.createForClass(User)