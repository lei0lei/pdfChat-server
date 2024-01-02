import { IsEmail, IsString } from "class-validator";


export class UserDto {
    @IsString()
    password: string;

    @IsString()
    username: string;

    @IsEmail()
    email:string;

  }