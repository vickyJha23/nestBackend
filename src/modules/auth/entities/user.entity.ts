import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {
    @Prop({required: true}) 
    name: string;
    @Prop({
          required: true,
          unique:  true,
    })
    email: string;
    @Prop({
        required: true,
        minLength: 3,
        maxLength: 8,
    })
    password: string;

    @Prop({
         default: 'user',
        enum: ['user', 'admin'],
    })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);