import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'kamil_T',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  username!: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'kamil@pl.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
