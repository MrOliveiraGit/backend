import { Controller, Get, Post, Body, Param, Delete, Res, InternalServerErrorException, Put,
 } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  /**
   * 
   * For create a new user and save in db
   * 
   * @param createUserDto 
   * @returns USer
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto,@Res() res: Response){
    const user = await this.userService.create(createUserDto);
    res.status(201).json({ user: user })
  }


    /**
   * 
   * this endpoint return a user from https://reqres.in/
   * 
   * @param id 
   * @returns 
   */
    @Get(':id')
    async findOne(@Param('id') id: number,@Res() res: Response) {
      const user = await this.userService.retriveByApi(id)
      res.status(200).json({ user: user })
    }


    @Get('avatar/:id')
    async findAvatar(@Param('id') id: number,@Res() res: Response){
      const avatar = await this.userService.getAvatar(id);
      res.status(200).json({avatar: avatar})
    }
    

  /**
   * 
   * this endpoint return a user from database
   * 
   * @param id 
   * @returns User
   */
  @Get('/db/:id')
  async retriveUser(@Param('id') id,@Res() res: Response) {

    const user = await this.userService.retriveByDb(id);
    res.status(200).json({ user: user })

  }
/**
 * 
 * this end point update the user storage in db
 * 
 * @param id number
 * @param updateUserDto 
 * @param res 
 */
  @Put('/:id')
  async updateUSer(@Param('id') id: number , @Body() updateUserDto: UpdateUserDto,@Res() res: Response) {
    const user = await this.userService.updateUser(id,updateUserDto);
    res.status(200).json({ user: user })
  }

  /**
   * 
   * this endpoint is for delete the avatar from the FileSystem and db
   * 
   * @param id 
   * @returns User
   */

  @Delete('avatar/:id')
  async removeAvatar(@Param('id') id: number, @Res() res: Response): Promise<void> {
    await this.userService.removeAvatar(id);
    res.status(200).send('Avatar successfully removed');
  }
}
