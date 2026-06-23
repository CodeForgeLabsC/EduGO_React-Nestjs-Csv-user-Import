import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  Res,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CsvImportResultDto } from '../dto/csv-import-result.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a single user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users sorted by creation date (DESC)' })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
    type: [UserResponseDto],
  })
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('export-csv')
  @ApiOperation({ summary: 'Export all users as CSV file' })
  @ApiResponse({
    status: 200,
    description: 'CSV file with all users',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async exportCsv(@Res() response: Response) {
    const csv = await this.usersService.exportUsersToCsv();

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="users_export.csv"',
    );
    response.send(csv);
  }

  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file with columns: username, email',
        },
      },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: 'Import users from a CSV file' })
  @ApiResponse({
    status: 201,
    description: 'CSV import completed',
    type: CsvImportResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid CSV format',
  })
  async importCsv(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV file');
    }

    return this.usersService.importCsv(file.buffer);
  }
}
