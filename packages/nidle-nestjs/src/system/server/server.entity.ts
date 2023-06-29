import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'server' })
export class Server {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 30, nullable: true, comment: '服务器名' })
  name: string;

  @Column({ length: 20, nullable: true, comment: '服务器ip' })
  ip: string;

  @Column({ length: 30, nullable: true, comment: '服务器描述' })
  description: string;

  @Column({ length: 20, nullable: true, comment: '服务器所属环境' })
  environment: string;

  @Column({ length: 30, nullable: true, comment: '服务器登录用户名' })
  username: string;

  @Column({ length: 30, nullable: true, comment: '服务器登录密码' })
  password: string;

  @Column({ type: 'int', nullable: true, comment: '服务器状态' })
  status: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTime: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedTime: Date;
}
