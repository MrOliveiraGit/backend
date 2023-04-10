import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsOptional } from "class-validator"


export class CreateUserDto  {
    @IsNotEmpty()
    @IsNumberString()
    id: number

    @IsNotEmpty()
    @IsString()
     firstName: string

    @IsNotEmpty()
    @IsString()
    @IsString()
    lastName?:string

    @IsOptional()
    @IsEmail()
    email?:string

    @IsString()
    @IsOptional()
    avatar?:string
}
