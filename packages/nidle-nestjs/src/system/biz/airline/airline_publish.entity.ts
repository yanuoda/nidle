import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'airline_publish' })
export class AirlinePublish {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 10, comment: '航司' })
  airline: string;

  @Column({ length: 20, comment: '所属环境' })
  environment: string;

  @Column({
    type: 'int',
    name: 'project_server',
    comment: '关联的项目服务器发布地址id',
  })
  projectServer: number;

  @Column({
    length: 255,
    name: 'relative_path',
    default: './',
    comment: '相对路径',
  })
  relativePath: string;

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
