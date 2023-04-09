import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile, } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import e, { Express,Response } from 'express';
import { extname, join } from 'path'
import { User } from './schemas/user.schema';
import { readdir } from 'fs';



@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  /**
   * 
   * For create a new user
   * 
   * @param createUserDto 
   * @returns USer
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }


    /**
   * t
   * this endpoint return a user from https://reqres.in/
   * 
   * @param id 
   * @returns 
   */
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.userService.retriveByApi(+id);
    }


    @Get(':id/avatar')
    async findAvatar(@Param('id') id: number,@Res() res: Response){
      const file = await this.userService.retriveAvatar(id)
      const files = readdir('../../../avatars',( err, files )=>{
        files.filter( file => console.log(file))
      })
      res.download(file)
      
    }
    

  /**
   * 
   * this endpoint return a user from database
   * 
   * @param id 
   * @returns User
   */
  @Get('/user-by-db/:id')
  retriveUser(@Param('id') id) {
    return this.userService.retriveByDb(id);
  }

  /**
   * 
   * this endpoint is for delete the avatar from the FileSystem and db
   * 
   * @param id 
   * @returns User
   */

  @Delete(':id/avatar')
  async removeAvatar(@Param('id') id: string) {
    return this.userService.removeAvatar(+id);
  }
}
