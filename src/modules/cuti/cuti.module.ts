import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuti } from './entities/cuti.entity';
import { CutiController } from './cuti.controller';
import { CutiService } from './cuti.service';
import { Pegawai } from '../pegawai/entities/pegawai.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuti, Pegawai])],
  controllers: [CutiController],
  providers: [CutiService],
  exports: [CutiService],
})
export class CutiModule {}
