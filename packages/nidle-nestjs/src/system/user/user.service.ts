import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as crypto from 'crypto';

import { Member } from './member.entity';
import { ModifyPasswordDto, QueryUserDto, RegisterDto } from './user.dto';
import { checkValue } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async find({ name, password, gitlabUserId, githubUserId }: QueryUserDto) {
    let where: FindOptionsWhere<Member> = {};
    if (name) {
      if (!password) throw new Error('缺少字段[password]');
      where = { name, password };
    } else if (gitlabUserId) {
      where = { gitlabUserId };
    } else if (githubUserId) {
      where = { githubUserId };
    } else {
      throw new Error('缺少入参');
    }
    const existUser = await this.memberRepository.findOne({
      select: ['id', 'name', 'gitlabUserId', 'githubUserId'],
      where,
    });
    if (!existUser) {
      if (name) throw new Error('用户名或密码错误');
      else {
        throw new Error(
          `用户:${JSON.stringify({ gitlabUserId, githubUserId })} 不存在`,
        );
      }
    }
    return existUser;
  }

  async findOneBy(id: number) {
    checkValue(id, '用户id');
    const user = await this.memberRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new Error(`用户:${id}不存在`);
    }
    return user;
  }

  async findAllByWhere(_where: FindOptionsWhere<Member>) {
    return await this.memberRepository.find({ where: _where });
  }

  async modifyPassword({ id, oldPassword, newPassword }: ModifyPasswordDto) {
    checkValue(id, '用户id');
    const existUser = await this.memberRepository.findOneBy({ id });
    if (!existUser) {
      throw new Error(`用户id:${id}不存在`);
    }
    if (oldPassword !== existUser.password) {
      throw new Error('旧密码输入错误，请重新输入！');
    }
    existUser.password = newPassword;
    return await this.memberRepository.save(existUser);
  }

  async register({ name, gitlabUserId }: RegisterDto) {
    const newUser = new Member();
    newUser.name = name;
    newUser.gitlabUserId = gitlabUserId;
    // 默认密码为 000000
    newUser.password = crypto.createHash('md5').update('000000').digest('hex');
    newUser.status = 0;
    return await this.memberRepository.save(newUser);
  }
}
