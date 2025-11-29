import { IsDateString, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCutiDto {
  @ApiProperty({ example: 'liburan keluarga' })
  @IsNotEmpty()
  @IsString()
  alasan: string;

  @ApiProperty({ example: '2025-12-01' })
  @IsDateString()
  tanggalMulai: string;

  @ApiProperty({ example: '2025-12-02' })
  @IsDateString()
  tanggalSelesai: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  pegawaiId: number;
}
