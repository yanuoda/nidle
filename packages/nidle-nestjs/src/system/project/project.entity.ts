import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Server } from '../server/server.entity';

@Entity({ name: 'project' })
export class Project {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 30, nullable: true, comment: '项目名' })
  name: string;

  @Column({ length: 255, nullable: true, comment: '项目描述' })
  description: string;

  @Column({ length: 100, nullable: true, comment: '项目负责人' })
  owner: string;

  @Column({
    length: 20,
    nullable: true,
    default: 'gitlab',
    comment: '项目仓库类型',
  })
  repositoryType: string;

  @Column({ length: 255, nullable: true, comment: '项目仓库地址' })
  repositoryUrl: string;

  @Column({ length: 500, nullable: true, comment: '通知邮件地址' })
  postEmails: string;

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
  gitlabId: number;

  @OneToMany(() => ProjectServer, (projectServer) => projectServer.project)
  projectServers: ProjectServer[];
}

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
