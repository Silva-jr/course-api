import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/shared/Users';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class AuthController {
  constructor(
    @InjectModel('User') private userModel: Model<Users>,
    private userRepo: UserRepository,
  ) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') plaintextPassword: string,
  ) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      console.log('User does exist on the database.');
      throw new UnauthorizedException();
    }

    return new Promise((resolve, reject) => {
      password(plaintextPassword).verifyAgainst(
        user.passwordHash,
        (err, verified) => {
          if (!verified) {
            reject(new UnauthorizedException());
          }

          const authJwtToken = jwt.sign(
            { email, roles: user.roles },
            JWT_SECRET,
          );

          resolve({ authJwtToken });
        },
      );
    });
  }

  @Post('create')
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Users> {
    /*     const existingUser = await this.userRepo.findByUsername(email);

    if (existingUser) {
      throw new Error('user ja existe');
    } */
    const salt = await bcrypt.genSalt();    
    const hashedPassword = await this.hashPassword(password, salt);    

    return this.userRepo.addUser(email, hashedPassword);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
