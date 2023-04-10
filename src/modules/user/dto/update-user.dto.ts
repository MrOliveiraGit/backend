import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto  {
    readonly nameFirst?: string
    readonly lastName?:string
    readonly email?:string
    readonly avatar?:string
}
