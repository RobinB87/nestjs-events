import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from './course.entity';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Resolver(() => Subject)
export class SubjectResolver {
  // use @Parent to get access to the parent object
  @ResolveField('teachers', () => [Teacher])
  teachers(@Parent() subject: Subject): Promise<Teacher[]> {
    return subject.teachers; // lazy
  }

  @ResolveField('courses', () => [Course])
  courses(@Parent() subject: Subject): Promise<Course[]> {
    return subject.courses;
  }
}
