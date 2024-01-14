import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { CourseResolver } from './course.resolver';
import { SubjectResolver } from './subject.resolver';
import { Teacher } from './teacher.entity';
import { TeacherResolver } from './teacher.resolver';
import { TrainingController } from './training.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  providers: [TeacherResolver, CourseResolver, SubjectResolver],
  controllers: [TrainingController],
})
export class SchoolModule {}
