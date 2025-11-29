import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../entities/pegawai.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePegawaiDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  namaDepan: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  namaBelakang: string;

  @ApiProperty({ example: 'john@mail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '081280763456' })
  @IsNotEmpty()
  @IsString()
  noHp: string;

  @ApiProperty({ example: 'Jalan Raya ABC Sentosa' })
  @IsNotEmpty()
  @IsString()
  alamat: string;

  @ApiProperty({ example: 'pria', enum: ['pria', 'perempuan'] })
  @IsNotEmpty()
  @IsEnum(Gender, {
    message: 'jenisKelamin harus bernilai pria atau perempuan',
  })
  jenisKelamin: Gender;
}
