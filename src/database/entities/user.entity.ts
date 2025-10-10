import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {
    [x: string]: any;
    @Prop({required: true}) 
    userName: string;
    @Prop({
          required: true,
          unique:  true,
    })
    email: string;
    @Prop({
        required: true,
        minLength: 3,
    })
    password: string;

    @Prop({
         default: 'user',
        enum: ['user', 'admin'],
    })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);