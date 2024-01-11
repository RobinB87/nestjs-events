import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb;
  let deleteQb;

  beforeEach(async () => {
    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event); // save = async (returns promise that should be resolved), so we use mockResolvedValue

      expect(
        service.updateEvent(new Event({ id: 1 }), { name: 'New name' }),
      ).resolves.toEqual({ id: 1 });
      expect(repoSpy).toHaveBeenCalledWith({ id: 1, name: 'New name' });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const createQueryBuilderSpy = jest.spyOn(
        repository,
        'createQueryBuilder',
      );

      const deleteSpy = jest.spyOn(selectQb, 'delete');
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      const eventToDeleteId = 1;
      expect(service.deleteEvent(eventToDeleteId)).resolves.toBeUndefined();

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', {
        id: eventToDeleteId,
      });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
