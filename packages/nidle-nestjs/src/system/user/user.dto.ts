import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
  readonly name: string;
  readonly gitlabUserId: number;
}

export class QueryUserDto {
  readonly name?: string;
  readonly password?: string;
  readonly gitlabUserId?: number;
  readonly githubUserId?: number;
}

class UserPicked {
  readonly id: number;
  readonly name?: string;
  readonly gitlabUserId?: number;
  readonly githubUserId?: number;
}
export class QueryUserResponseDto {
  readonly data: UserPicked;
}

export class ModifyPasswordDto {
  @IsNotEmpty()
  readonly id: number;
  @IsNotEmpty()
  readonly oldPassword: string;
  @IsNotEmpty()
  readonly newPassword: string;
}
