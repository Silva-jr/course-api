import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/shared/course';
import { Model } from 'mongoose';

@Injectable()
export class CoursesRepository {
  constructor(@InjectModel('Courses') private courseModel: Model<Course>) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel.find();
  }

  updateCourse(courseID: string, changes: Partial<Course>): Promise<Course> {
    return this.courseModel.findOneAndUpdate({ _id: courseID }, changes, {
      new: true,
    });
  }

  deleteCourse(courseID: string){
   return this.courseModel.deleteOne({_id: courseID})
  }

  async addCourse(course: Partial<Course>):Promise<Course> {
   const newCourse = new this.courseModel(course);
   await newCourse.save();
   return newCourse.toObject({versionKey: false})
  }
}
