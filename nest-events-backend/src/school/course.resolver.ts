import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from './course.entity';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Resolver(() => Course)
export class CourseResolver {
  @ResolveField('teacher', () => Teacher)
  teachers(@Parent() course: Course): Promise<Teacher> {
    return course.teacher;
  }

  @ResolveField('subject', () => Subject)
  courses(@Parent() course: Course): Promise<Subject> {
    return course.subject;
  }
}
