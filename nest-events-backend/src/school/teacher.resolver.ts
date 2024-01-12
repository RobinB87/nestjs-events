import { Query, Resolver } from '@nestjs/graphql';
import { Teacher } from './teacher.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  @Query(() => [Teacher])
  async teachers(): Promise<Teacher[]> {
    return [] as Teacher[];
  }
}
