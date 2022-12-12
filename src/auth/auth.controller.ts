import {Body, Controller, ParseIntPipe, Post, Req} from '@nestjs/common'
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController{
   constructor(private authService:AuthService){}

   @Post('signup')
   signup(@Body() dto: AuthDto){
    return this.authService.signup(dto);
    
   }

   @Post('signin')
   sigin(@Body() dto: AuthDto){
    return this.authService.signin(dto);
   }
}