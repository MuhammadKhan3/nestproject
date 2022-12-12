import {ForbiddenException, Injectable} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
// import {User,Bookmark} from 'prisma/prisma-client'
@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService){}
    async signup(dto: AuthDto){
        const hash =await argon2.hash(dto.password);

        try {
            const user=await this.prisma.user
            .create({
                data:{
                    email:dto.email,
                    password:hash,
                },
                // select:{
                //     id:true,
                //     email:true,
                //     createdAt:true
                // }
            });
            delete user.password
            return user;            
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                console.log(PrismaClientKnownRequestError)
                if(error.code==='P2002'){
                    throw new ForbiddenException('Credentials Already taken');
                }
                throw error;
            }
        }

    }
    async signin(dto: AuthDto){

        const user=await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            }
        })

        if(!user){
            throw new ForbiddenException('Crendentials inncorrect')
        }

        const pwd=await argon2.verify(user.password,dto.password);
        console.log(pwd)

        if(!pwd){
            throw new ForbiddenException('Crendentials inncorrect')
        }      
        
        delete user.password;
        
        
        return user;
    }
}