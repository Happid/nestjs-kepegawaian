import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PegawaiModule } from './modules/pegawai/pegawai.module';
import { CutiModule } from './modules/cuti/cuti.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseConfig(),
    AdminModule,
    AuthModule,
    PegawaiModule,
    CutiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
