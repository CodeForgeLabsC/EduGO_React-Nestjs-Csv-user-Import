import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entities/user.entity';
import { DuplicateEmailException } from '../../common/exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  const mockUser: UserEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'kamil_T',
    email: 'kamil@pl.com',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto = { username: 'kamil_T', email: 'kamil@pl.com' };
      const result = await service.createUser(dto);

      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: dto.username,
          email: dto.email,
        }),
      );
    });

    it('should throw DuplicateEmailException if email exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const dto = { username: 'katia_T', email: 'kamil@pl.com' };
      await expect(service.createUser(dto)).rejects.toThrow(
        DuplicateEmailException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users sorted by createdAt DESC', async () => {
      const result = await service.getUsers();

      expect(result).toEqual([mockUser]);
      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('importCsv', () => {
    it('should handle empty CSV', async () => {
      const buffer = Buffer.from('username,email\n');
      const result = await service.importCsv(buffer);

      expect(result.totalRows).toBe(0);
      expect(result.successCount).toBe(0);
      expect(result.createdUsers).toEqual([]);
    });

    it('should import valid CSV rows', async () => {
      const csv = 'username,email\nkamil,kamil@pl.com\nkatia,katia@pl.com';
      const buffer = Buffer.from(csv);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce({
          ...mockUser,
          email: 'kamil@pl.com',
        })
        .mockResolvedValueOnce({
          ...mockUser,
          id: 'another-id',
          email: 'katia@pl.com',
        });

      const result = await service.importCsv(buffer);

      expect(result.totalRows).toBe(2);
      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(0);
    });

    it('should handle invalid email in CSV', async () => {
      const csv = 'username,email\nkamil,invalid-email\n';
      const buffer = Buffer.from(csv);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      const result = await service.importCsv(buffer);

      expect(result.totalRows).toBe(1);
      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(1);
      expect(result.errors[0].error).toContain('email');
    });

    it('should detect duplicate emails within CSV', async () => {
      const csv = 'username,email\nkamil,kamil@pl.com\nkatia,kamil@pl.com\n';
      const buffer = Buffer.from(csv);

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...mockUser,
        email: 'kamil@pl.com',
      });

      const result = await service.importCsv(buffer);

      expect(result.totalRows).toBe(2);
      expect(result.successCount).toBe(1);
      expect(result.failureCount).toBe(1);
      expect(result.errors[0].error).toContain('already exists');
    });
  });
});
