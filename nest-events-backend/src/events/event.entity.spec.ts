import { Event } from './event.entity';

test('should be initialized through constructor', () => {
  const event = new Event({
    name: 'some event',
    description: 'funnn',
  });

  expect(event).toEqual({
    name: 'some event',
    description: 'funnn',
    id: undefined,
    when: undefined,
    // ... etc
  });
});
