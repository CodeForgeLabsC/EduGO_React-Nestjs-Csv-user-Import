import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'The username of the user',
  })
  username!: string;

  @ApiProperty({
    description: 'The email address of the user',
  })
  email!: string;

  @ApiProperty({
    description: 'The creation timestamp',
    type: Date,
  })
  createdAt!: Date;
}
