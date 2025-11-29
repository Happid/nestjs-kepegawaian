import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pegawai } from '../../pegawai/entities/pegawai.entity';

@Entity({ name: 'tbl_cuti' })
export class Cuti {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alasan: string;

  @Column({ type: 'date' })
  tanggalMulai: string;

  @Column({ type: 'date' })
  tanggalSelesai: string;

  @ManyToOne(() => Pegawai, (pegawai) => pegawai.cuti, { onDelete: 'CASCADE' })
  pegawai: Pegawai;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
