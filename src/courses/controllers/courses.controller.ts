import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { CoursesRepository } from '../repositories/courses.repository';
import { Course } from 'src/shared/course';

@Controller('courses')
export class CoursesController {
  constructor(private coursesDB: CoursesRepository) {}

  @Post()
  async createCourse(@Body() course: Partial<Course>): Promise<Course> {
    console.log('creating course');

    return this.coursesDB.addCourse(course);
  }

  @Get()
  async findAllCourses() {
    return this.coursesDB.findAll();
  }

  @Put('update/:courseID')
  async updateCourses(
    @Param('courseID') courseID: string,
    @Body() changes: Course,
  ): Promise<Course> {
    
    console.log('updating courses');    

    if (changes._id) {
      throw new BadRequestException("Can't update courses id");
    }
    return this.coursesDB.updateCourse(courseID, changes);
  }

  @Delete(':courseID')
  async deleteCourses(@Param('courseID') courseID: string) {
    console.log('deleting courses');
    return this.coursesDB.deleteCourse(courseID);
  }
}
