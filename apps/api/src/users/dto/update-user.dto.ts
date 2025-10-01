import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'User email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, description: 'User password' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    required: false,
    enum: Role,
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
