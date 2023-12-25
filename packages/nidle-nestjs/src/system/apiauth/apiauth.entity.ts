import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'api_auth' })
export class Apiauth {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({
    length: 32,
    name: 'api_key',
    comment: '调用权限key',
  })
  apiKey: string;

  @Column({
    type: 'datetime',
    name: 'last_invoke_time',
    nullable: true,
  })
  lastInvokeTime: Date;

  @Column({ type: 'int', default: 1, comment: '配置状态：0=禁用 1=启用' })
  status: number;

  @Column({ length: 255, nullable: true, comment: '描述' })
  description: string;

  @Column({
    type: 'datetime',
    name: 'created_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTime: Date;

  @Column({
    type: 'datetime',
    name: 'updated_time',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedTime: Date;
}
