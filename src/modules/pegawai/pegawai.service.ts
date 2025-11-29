import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pegawai } from './entities/pegawai.entity';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(Pegawai)
    private repository: Repository<Pegawai>,
  ) {}

  async create(data: CreatePegawaiDto): Promise<Pegawai> {
    try {
      const pegawai = this.repository.create(data);
      return await this.repository.save(pegawai);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email sudah digunakan');
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Pegawai[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      relations: ['cuti'],
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Pegawai> {
    const pegawai = await this.repository.findOne({
      where: { id },
      relations: ['cuti'],
    });

    if (!pegawai) throw new NotFoundException('Pegawai tidak ditemukan');

    return pegawai;
  }

  async update(id: number, data: UpdatePegawaiDto): Promise<Pegawai> {
    await this.findOne(id);
    await this.repository.update(id, data);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<any> {
    const pegawai = await this.findOne(id);
    await this.repository.delete(id);

    return {
      message: 'Data pegawai berhasil dihapus',
      data: pegawai,
    };
  }
}
