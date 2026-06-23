import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class CsvRowError {
  @ApiProperty({
    description: 'The row number in the CSV file',
  })
  rowNumber!: number;

  @ApiProperty({
    description: 'Error message describing what went wrong',
  })
  error!: string;

  @ApiProperty({
    description: 'The data from the problematic row',
    type: 'object',
  })
  data?: Record<string, string>;
}

export class CsvImportResultDto {
  @ApiProperty({
    description: 'Total number of rows processed (excluding header)',
  })
  totalRows!: number;

  @ApiProperty({
    description: 'Number of users successfully created',
  })
  successCount!: number;

  @ApiProperty({
    description: 'Number of rows that failed validation',
  })
  failureCount!: number;

  @ApiProperty({
    description: 'Array of successfully created users',
    type: [UserResponseDto],
  })
  createdUsers!: UserResponseDto[];

  @ApiProperty({
    description: 'Array of errors encountered during import',
    type: [CsvRowError],
  })
  errors!: CsvRowError[];
}
