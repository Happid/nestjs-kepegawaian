import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/admin.entity';

export class CreateAdminDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  namaDepan: string;

  @ApiProperty({ example: 'Cena' })
  @IsNotEmpty()
  @IsString()
  namaBelakang: string;

  @ApiProperty({ example: 'admin@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty()
  tanggalLahir: string;

  @ApiProperty({ example: 'pria', enum: ['pria', 'perempuan'] })
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: 'jenisKelamin harus bernilai pria atau perempuan',
  })
  jenisKelamin: Gender;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
