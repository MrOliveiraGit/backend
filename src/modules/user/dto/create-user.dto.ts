export class CreateUserDto  {
    readonly id: number
    readonly nameFirst: string
    readonly lastName:string
    readonly email:string
    readonly avatar?:string
}
