import { IsNotEmpty } from 'class-validator';
export class IndexDto {
  @IsNotEmpty()
  readonly type: string;
}

export class CallbackQueryDto {
  @IsNotEmpty()
  readonly code: string;
}
