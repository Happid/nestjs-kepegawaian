import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsEnum, MinLength, IsOptional } from 'class-validator';
import { Gender } from '../entities/admin.entity';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsEnum(Gender, {
    message: 'jenisKelamin harus bernilai pria atau perempuan',
  })
  jenisKelamin?: Gender;

  @IsOptional()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password?: string;
}
