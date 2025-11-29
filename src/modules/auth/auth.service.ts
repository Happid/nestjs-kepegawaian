import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const result = await this.adminService.login(email, password);

    // generate JWT token
    const token = await this.jwtService.signAsync({
      sub: result.admin.id,
      email: result.admin.email,
    });

    return {
      message: 'Login berhasil',
      token,
      admin: result.admin,
    };
  }
}
