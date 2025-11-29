import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private repository: Repository<Admin>,
  ) {}

  async create(data: CreateAdminDto): Promise<Admin> {
    try {
      data.password = await bcrypt.hash(data.password, 10);
      const admin = this.repository.create(data);
      return await this.repository.save(admin);
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(['Email sudah digunakan']);
      }

      throw new InternalServerErrorException('Terjadi kesalahan pada server');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Omit<Admin, 'password'>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const sanitized = data.map((admin) => {
      const { password, ...rest } = admin;
      return rest;
    });

    return {
      data: sanitized,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const admin = await this.repository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    const { password, ...rest } = admin;

    return {
      message: 'Data berhasil ditemukan',
      data: rest,
    };
  }

  async update(id: number, data: UpdateAdminDto): Promise<Admin> {
    await this.findOne(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.repository.update(id, data);

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Admin tidak ditemukan');

    return updated;
  }

  async remove(id: number) {
    const admin = await this.repository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('Admin tidak ditemukan');
    }

    await this.repository.delete(id);

    const { password, ...rest } = admin;

    return {
      message: 'Data berhasil dihapus',
      data: rest,
    };
  }

  async login(email: string, password: string) {
    const admin = await this.repository.findOne({ where: { email } });

    if (!admin) {
      throw new NotFoundException('Email tidak ditemukan');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    return {
      message: 'Login berhasil',
      admin: {
        id: admin.id,
        namaDepan: admin.namaDepan,
        namaBelakang: admin.namaBelakang,
        email: admin.email,
      },
    };
  }
}
