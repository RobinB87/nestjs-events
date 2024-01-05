import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false }) // use { nullable: false } when an attendee can not exists without an event
  // @JoinColumn({ name: 'event_id', referencedColumnName: 'secondary' }) // use when you want to point to a different column
  event: Event;
}
