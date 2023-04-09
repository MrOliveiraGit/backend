export class CreateUserDto  {
    readonly id: number
    readonly name_first: string
    readonly last_name:string
    readonly email:string
    readonly avatar?:string
}
