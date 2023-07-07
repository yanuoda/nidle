import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { ProjectServer } from './project_server.entity';

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
