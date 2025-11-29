import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cuti } from '../../cuti/entities/cuti.entity';

export enum Gender {
  PRIA = 'pria',
  PEREMPUAN = 'perempuan',
}

@Entity({ name: 'tbl_pegawai' })
export class Pegawai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaDepan: string;

  @Column()
  namaBelakang: string;

  @Column({ unique: true })
  email: string;

  @Column()
  noHp: string;

  @Column()
  alamat: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  jenisKelamin: Gender;

  @OneToMany(() => Cuti, (cuti) => cuti.pegawai)
  cuti: Cuti[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
