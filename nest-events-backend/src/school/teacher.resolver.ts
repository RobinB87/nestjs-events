import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  teachers(): Promise<Teacher[]> {
    return this.teachersRepository.find({
      relations: ['subjects'],
    });
  }

  @Query(() => Teacher)
  teacher(@Args('id', { type: () => Int }) id: number): Promise<Teacher> {
    return this.teachersRepository.findOneOrFail({
      where: { id },
      relations: ['subjects'],
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' }) // as teacher is already used for get?
  add(
    @Args('input', { type: () => Teacher }) teacher: Teacher, // for simplicity no dto is created
  ): Promise<Teacher> {
    return this.teachersRepository.save(teacher);
  }
}
