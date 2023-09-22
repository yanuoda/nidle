import { Body, Controller, Get, Post, Session, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { FormatResponse, SessionDto } from 'src/common/base.dto';
import { getSessionUser } from 'src/utils';
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
  async getUser(@Req() req: Request, @Session() session: SessionDto) {
    req.session.touch(); // 更新 cookie 过期时间
    return { data: getSessionUser(session) };
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
