import { InputType, OmitType, PartialType } from '@nestjs/graphql'; // for graphql this one is required! (not @nestjs/mapped-types)
import { TeacherAddInput } from './teacher-add.input';

@InputType()
export class TeacherEditInput extends PartialType(
  // if you want to make sure only certain properties can't be changed, use OmitType
  // of course can also always declare your own type
  OmitType(TeacherAddInput, ['gender']),
) {}
