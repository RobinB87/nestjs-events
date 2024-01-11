import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Attendee } from '../events/attendee.entity';
import { Event } from '../events/event.entity';

// export default factory function is required
// config files can be namespaced by wrapping with registerAs
export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Attendee, Event, User],
    synchronize: true,
  }),
);
