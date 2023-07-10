import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'member' })
@Unique(['name'])
export class Member {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 30, nullable: true })
  login: string;

  @Column({ length: 30, comment: '用户名' })
  name: string;

  @Column({ length: 32, nullable: true })
  password: string;

  @Column({ type: 'int', nullable: true, comment: '用户角色' })
  role: number;

  @Column({ type: 'int', nullable: true, default: 0, comment: '用户状态' })
  status: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTime: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedTime: Date;

  @Column({ type: 'int', nullable: true })
  gitlabUserId: number;

  @Column({ type: 'int', nullable: true })
  githubUserId: number;
}
