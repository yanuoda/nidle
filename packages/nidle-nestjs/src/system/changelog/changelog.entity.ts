import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  NEW = 'NEW',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  CANCEL = 'CANCEL',
}
export enum StatusNum {
  NEW,
  PENDING,
  SUCCESS,
  FAIL,
  CANCEL,
}
export enum CodeReviewStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

@Entity({ name: 'changelog' })
export class Changelog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 255, nullable: true, comment: '' })
  period: string;

  @Column({ type: 'int', nullable: true, comment: '所属项目id' })
  project: number;

  @Column({ length: 30, nullable: true, comment: '部署分支' })
  branch: string;

  @Column({ length: 255, nullable: true })
  commitId: string;

  @Column({ type: 'int', nullable: true, comment: '开发人员id' })
  developer: number;

  @Column({ length: 20, nullable: true, comment: '' })
  source: string;

  @Column({ type: 'enum', enum: Status, nullable: true })
  status: Status;

  @Column({ type: 'enum', enum: CodeReviewStatus, nullable: true })
  codeReviewStatus: CodeReviewStatus;

  @Column({ length: 20, nullable: true, comment: '所属环境' })
  environment: string;

  @Column({ length: 20, nullable: true, comment: '' })
  stage: string;

  @Column({ type: 'int', nullable: true, comment: '发布耗时' })
  duration: number;

  @Column({ length: 255, nullable: true })
  configPath: string;

  @Column({ length: 255, nullable: true })
  logPath: string;

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
  active: number;

  @Column({ length: 20, default: 'normal', comment: '发布类型' })
  type: string;

  @Column({ length: 255, nullable: true, comment: '描述' })
  description: string;
}
