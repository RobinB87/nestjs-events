import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/pagination/paginator';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Gender } from './school.types';
import { Subject } from './subject.entity';

@Entity()
@ObjectType()
export class Teacher {
  constructor(partial?: Partial<Teacher>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  @Field(() => Gender)
  gender: Gender;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject]) // specify explicitly that this is an array of teachers for graphql
  subjects: Promise<Subject[]>; // make lazy by using promise. Now the subjects are only fetched when you really specify it in the query

  @OneToMany(() => Course, (course) => course.teacher)
  @Field(() => [Teacher], { nullable: true })
  courses: Promise<Course[]>;
}

@ObjectType()
export class PaginatedTeachers extends Paginated<Teacher>(Teacher) {}
