import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  PRIA = 'pria',
  PEREMPUAN = 'perempuan',
}

@Entity({ name: 'tbl_admin' })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaDepan: string;

  @Column()
  namaBelakang: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'date' })
  tanggalLahir: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  jenisKelamin: Gender;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
