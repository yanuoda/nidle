import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { FormatResponse, SessionDto } from 'src/common/base.dto';
import { UserService } from './user.service';
import {
  QueryUserDto,
  ModifyPasswordDto,
  QueryUserResponseDto,
} from './user.dto';

@ApiTags('用户相关接口')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取用户信息' })
  @Get()
  async getUser(@Session() session: SessionDto) {
    if (session.user) return session.user;
    /** @todo customer error */
    throw new Error('请先登录');
  }

  @Post('login')
  async login(
    @Body() body: QueryUserDto,
    @Session() session: SessionDto,
  ): Promise<QueryUserResponseDto> {
    const data = await this.userService.find(body);
    const { id, name, gitlabUserId, githubUserId } = data;
    session.user = { id, name, gitlabUserId, githubUserId };
    return { data };
  }

  @Get('logout')
  async logout(@Session() session: SessionDto): Promise<FormatResponse> {
    session.user = null;
    return {};
  }

  @ApiOperation({ summary: '修改密码' })
  @Post('modifypassword')
  async modifyPassword(
    @Body() body: ModifyPasswordDto,
    @Session() session: SessionDto,
  ): Promise<FormatResponse> {
    await this.userService.modifyPassword(body);
    session.user = null;
    return {};
  }
}
