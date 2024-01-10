import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

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

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false }) // use { nullable: false } when an attendee can not exists without an event
  // @JoinColumn({ name: 'event_id', referencedColumnName: 'secondary' }) // use when you want to point to a different column
  event: Event;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Rejected,
  })
  @Expose()
  answer: AttendeeAnswerEnum;
}
