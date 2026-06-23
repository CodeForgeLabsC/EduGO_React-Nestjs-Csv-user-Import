import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { CsvImportResultDto, CsvRowError } from '../dto/csv-import-result.dto';
import {
  ValidationException,
  DuplicateEmailException,
  CsvParsingException,
} from '../../common/exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new DuplicateEmailException(createUserDto.email);
    }

    const user = this.usersRepository.create({
      id: uuidv4(),
      ...createUserDto,
    });

    return this.usersRepository.save(user);
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async importCsv(
    buffer: Buffer,
  ): Promise<CsvImportResultDto> {
    let records: Record<string, string>[];

    try {
      const csvContent = buffer.toString('utf-8');
      records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
    } catch (error) {
      throw new CsvParsingException(
        error instanceof Error ? error.message : 'Unknown parsing error',
      );
    }

    if (!records || records.length === 0) {
      return {
        totalRows: 0,
        successCount: 0,
        failureCount: 0,
        createdUsers: [],
        errors: [],
      };
    }

    const result: CsvImportResultDto = {
      totalRows: records.length,
      successCount: 0,
      failureCount: 0,
      createdUsers: [],
      errors: [],
    };

    // Get all existing emails for fast duplicate checking
    const existingUsers = await this.usersRepository.find({
      select: ['email'],
    });
    const existingEmails = new Set(existingUsers.map((u) => u.email));
    const importedEmails = new Set<string>();

    for (let rowIndex = 0; rowIndex < records.length; rowIndex++) {
      const record = records[rowIndex];
      const rowNumber = rowIndex + 2; // +2 because header is row 1, data starts at row 2

      const rowErrors: string[] = [];

      if (!record.username || record.username.trim() === '') {
        rowErrors.push('Username is required');
      }

      if (!record.email || record.email.trim() === '') {
        rowErrors.push('Email is required');
      }

      if (rowErrors.length > 0) {
        result.failureCount++;
        result.errors.push({
          rowNumber,
          error: rowErrors.join('; '),
          data: record,
        });
        continue;
      }

      const createUserDto = plainToInstance(CreateUserDto, {
        username: record.username.trim(),
        email: record.email.trim().toLowerCase(),
      }) as CreateUserDto;

      const validationErrors = await validate(createUserDto);

      if (validationErrors.length > 0) {
        const errorMessages = validationErrors
          .map((err) => Object.values(err.constraints || {}).join(', '))
          .join('; ');

        result.failureCount++;
        result.errors.push({
          rowNumber,
          error: errorMessages,
          data: record,
        });
        continue;
      }

      // Check for duplicate email (both in DB and in current import)
      if (
        existingEmails.has(createUserDto.email) ||
        importedEmails.has(createUserDto.email)
      ) {
        result.failureCount++;
        result.errors.push({
          rowNumber,
          error: `Email '${createUserDto.email}' already exists`,
          data: record,
        });
        continue;
      }

      try {
        const user = this.usersRepository.create({
          id: uuidv4(),
          username: createUserDto.username,
          email: createUserDto.email,
        });

        const savedUser = await this.usersRepository.save(user);
        importedEmails.add(createUserDto.email);
        existingEmails.add(createUserDto.email);

        result.createdUsers.push(savedUser);
        result.successCount++;
      } catch (error) {
        this.logger.error(
          `Error creating user from CSV row ${rowNumber}`,
          error,
        );
        result.failureCount++;
        result.errors.push({
          rowNumber,
          error:
            error instanceof Error
              ? error.message
              : 'Unknown error creating user',
          data: record,
        });
      }
    }

    return result;
  }

  async exportUsersToCsv(): Promise<string> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });

    const headers = 'username,email,createdAt';
    const rows = users.map((user) => {
      const createdAtStr = user.createdAt.toISOString();
      return `${user.username},${user.email},${createdAtStr}`;
    });

    return [headers, ...rows].join('\n');
  }
}
