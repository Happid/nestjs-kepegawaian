import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuti } from './entities/cuti.entity';
import { Repository } from 'typeorm';
import { CreateCutiDto } from './dto/create-cuti.dto';
import { UpdateCutiDto } from './dto/update-cuti.dto';
import { Pegawai } from '../pegawai/entities/pegawai.entity';
import dayjs from 'dayjs';

@Injectable()
export class CutiService {
  constructor(
    @InjectRepository(Cuti)
    private repository: Repository<Cuti>,

    @InjectRepository(Pegawai)
    private pegawaiRepo: Repository<Pegawai>,
  ) {}

  async create(dto: CreateCutiDto) {
    const pegawai = await this.pegawaiRepo.findOne({
      where: { id: dto.pegawaiId },
      relations: ['cuti'],
    });
    if (!pegawai) throw new NotFoundException('Pegawai tidak ditemukan');

    // hitung jumlah hari cuti
    const start = dayjs(dto.tanggalMulai);
    const end = dayjs(dto.tanggalSelesai);
    const totalHari = end.diff(start, 'day') + 1;

    if (totalHari <= 0) {
      throw new BadRequestException('Tanggal cuti tidak valid');
    }

    // Validasi total cuti 12 hari per tahun
    const tahun = start.year();
    const existing = pegawai.cuti.filter(
      (c) => dayjs(c.tanggalMulai).year() === tahun,
    );

    const usedDays = existing.reduce((sum, item) => {
      return (
        sum +
        (dayjs(item.tanggalSelesai).diff(dayjs(item.tanggalMulai), 'day') + 1)
      );
    }, 0);

    if (usedDays + totalHari > 12) {
      throw new BadRequestException(
        `Cuti melebihi batas 12 hari dalam 1 tahun. Sisa hari: ${12 - usedDays}`,
      );
    }

    // Validasi tidak boleh 2 cuti dalam bulan yang sama
    const bulan = start.month();
    const sameMonth = existing.some(
      (c) => dayjs(c.tanggalMulai).month() === bulan,
    );

    if (sameMonth) {
      throw new BadRequestException(
        'Cuti sudah pernah dilakukan pada bulan yang sama',
      );
    }

    const cuti = this.repository.create({
      alasan: dto.alasan,
      tanggalMulai: dto.tanggalMulai,
      tanggalSelesai: dto.tanggalSelesai,
      pegawai,
    });
    const savedCuti = await this.repository.save(cuti);

    const pegawaiData = {
      id: pegawai.id,
      namaDepan: pegawai.namaDepan,
      namaBelakang: pegawai.namaBelakang,
      email: pegawai.email,
      noHp: pegawai.noHp,
      alamat: pegawai.alamat,
      jenisKelamin: pegawai.jenisKelamin,
      createdAt: pegawai.createdAt,
      updatedAt: pegawai.updatedAt,
    };

    return {
      ...savedCuti,
      pegawai: pegawaiData,
    };
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [cutis, total] = await this.repository.findAndCount({
      relations: ['pegawai'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const data = cutis.map((cuti) => {
      const { pegawai, ...rest } = cuti;
      return {
        ...rest,
        idPegawai: pegawai?.id ?? null,
      };
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const cuti = await this.repository.findOne({
      where: { id },
      relations: ['pegawai'],
    });
    if (!cuti) throw new NotFoundException('Cuti tidak ditemukan');
    return cuti;
  }

  async update(id: number, dto: UpdateCutiDto) {
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const cuti = await this.findOne(id);
    await this.repository.delete(id);

    return {
      message: 'Cuti berhasil dihapus',
      data: cuti,
    };
  }
}
