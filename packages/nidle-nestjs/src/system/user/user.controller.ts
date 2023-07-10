import { Body, Controller, Get, Post, Session } from '@nestjs/common';

import { SessionDto } from 'src/common/base.dto';
import { UserService } from './user.service';
import { QueryUserDto, ModifyPasswordDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Session() session: SessionDto) {
    if (session.user) return session.user;
    /** @todo customer error */
    throw new Error('请先登录');
  }

  @Post('login')
  async login(@Body() body: QueryUserDto, @Session() session: SessionDto) {
    const data = await this.userService.find(body);
    const { id, name, gitlabUserId, githubUserId } = data;
    session.user = { id, name, gitlabUserId, githubUserId };
    return { data };
  }

  @Get('logout')
  async logout(@Session() session: SessionDto) {
    session.user = null;
    return {};
  }

  @Post('modifypassword')
  async modifyPassword(
    @Body() body: ModifyPasswordDto,
    @Session() session: SessionDto,
  ) {
    await this.userService.modifyPassword(body);
    session.user = null;
    return {};
  }
}
