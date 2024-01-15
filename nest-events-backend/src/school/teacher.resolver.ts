import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuardJwtGql } from '../auth/auth-guard-jwt-gql';
import { paginate } from '../pagination/paginator';
import { TeacherAddInput } from './input/teacher-add.input';
import { TeacherEditInput } from './input/teacher-edit.input';
import { EntityWithId } from './school.types';
import { Subject } from './subject.entity';
import { PaginatedTeachers, Teacher } from './teacher.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger(TeacherResolver.name);

  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  @Query(() => PaginatedTeachers)
  teachers(): Promise<PaginatedTeachers> {
    return paginate<Teacher, PaginatedTeachers>(
      this.teachersRepository.createQueryBuilder(),
      PaginatedTeachers,
    );
  }

  @Query(() => Teacher)
  teacher(@Args('id', { type: () => Int }) id: number): Promise<Teacher> {
    return this.teachersRepository.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' }) // as teacher is already used for get?
  @UseGuards(AuthGuardJwtGql)
  add(
    @Args('input', { type: () => TeacherAddInput }) input: TeacherAddInput,
  ): Promise<Teacher> {
    return this.teachersRepository.save(new Teacher(input));
  }

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  async edit(
    @Args('id', { type: () => Int })
    id: number,
    @Args('input', { type: () => TeacherEditInput }) input: TeacherEditInput,
  ): Promise<Teacher> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: { id },
    });
    return this.teachersRepository.save(
      new Teacher(Object.assign(teacher, input)),
    );
  }

  @Mutation(() => EntityWithId, { name: 'teacherDelete' })
  async delete(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<EntityWithId> {
    const teacher = await this.teachersRepository.findOneOrFail({
      where: { id },
    });

    await this.teachersRepository.remove(teacher);

    return new EntityWithId(id);
  }

  @ResolveField('subjects')
  subjects(@Parent() teacher: Teacher): Promise<Subject[]> {
    this.logger.debug('@ResolveField subjects was called');
    return teacher.subjects; // lazy loaded relationship. So if you call without subjects { teacher }, this action  won't be called
  }
}
