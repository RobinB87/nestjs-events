import { InputType, PartialType } from '@nestjs/graphql'; // for graphql this one is required! (not @nestjs/mapped-types)
import { TeacherAddInput } from './teacher-add.input';

@InputType()
export class TeacherEditInput extends PartialType(TeacherAddInput) {}
