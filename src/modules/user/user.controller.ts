import { Controller, Get, Post, Body, Patch, Param, Delete,  UploadedFile,
  UseInterceptors, } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import e, { Express } from 'express';
import { extname } from 'path'
import { User } from './schemas/user.schema';


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
   *  this rout is just for test de email sending
   * 
   * @param email 
   * @returns null
   */
  @Post('testEmail/:email')
  sendEmail(@Param('email') email: string){
    console.log('aaaaaaaaaaaaaaaaa')
    return this.userService.justSendTestEmail(email)
  }


  /**
   * 
   * return the updated avar of user
   * 
   * @param id 
   * @param file 
   * @returns  user
   */
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/modules/user/avatars'
      , filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return this.userService.updateAvatar(id,file)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
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
