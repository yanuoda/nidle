import { IsNotEmpty, IsNumber } from 'class-validator';

export class QueryUserDto {
  name?: string;
  password?: string;
  gitlabUserId?: number;
  githubUserId?: number;
}

export class ModifyPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  oldPassword: string;
  @IsNotEmpty()
  newPassword: string;
}
