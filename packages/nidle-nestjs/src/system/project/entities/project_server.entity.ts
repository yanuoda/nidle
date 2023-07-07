import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Server } from '../../server/server.entity';
import { Project } from './project.entity';

@Entity({ name: 'project_server' })
export class ProjectServer {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 20, nullable: true, comment: '服务器配置所属环境' })
  environment: string;

  @Column({ length: 255, nullable: true, comment: '服务器部署目录' })
  output: string;

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

  @Column({
    type: 'int',
    nullable: true,
    comment: '发布记录id（表示此配置是否被占用）',
  })
  changelog: number;

  @Column({ length: 30, nullable: true, comment: '服务器配置描述' })
  description: string;

  @ManyToOne(() => Project, (project) => project.projectServers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project' })
  project: Project;

  @ManyToOne(() => Server, (server) => server.projectServers, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'server' })
  server: Server;
}
