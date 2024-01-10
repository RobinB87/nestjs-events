import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from 'src/auth/user.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, { nullable: true }) // use { nullable: false } when an attendee can not exists without an event
  // @JoinColumn({ name: 'event_id', referencedColumnName: 'secondary' }) // use when you want to point to a different column
  @JoinColumn()
  event: Event;

  @Column()
  eventId: number; // creates a relationship, this saves a roundtrip to the db, to get an event first and then associate it with an attendee

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Rejected,
  })
  @Expose()
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => (user) => user.attended)
  @Expose()
  user: User;

  @Column()
  userId: number;
}
