import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/shared/Users';

@Injectable()
export class UserRepository {
  users: Users;
  constructor(@InjectModel('User') private userModel: Model<Users>) {}

  async addUser(email: string, passwordHash: string): Promise<Users> {
    console.log("salvando", email, passwordHash)


    const newUser = new this.userModel({email, passwordHash});
    await newUser.save();
    return newUser.toObject({ versionKey: false });
  }

  async findByUsername(username: string): Promise<Users[]> {
    return this.userModel.find((u) => u.email === username);
  }
}
