import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAddInput } from './input/teacher-add.input';
import { Teacher } from './teacher.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  teachers(): Promise<Teacher[]> {
    return this.teachersRepository.find();
  }

  @Query(() => Teacher)
  teacher(@Args('id', { type: () => Int }) id: number): Promise<Teacher> {
    return this.teachersRepository.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' }) // as teacher is already used for get?
  add(
    @Args('input', { type: () => TeacherAddInput }) input: TeacherAddInput,
  ): Promise<Teacher> {
    return this.teachersRepository.save(new Teacher(input));
  }
}
