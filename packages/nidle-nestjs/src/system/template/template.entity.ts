import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'template' })
export class Template {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 30, nullable: true, comment: '模板名称' })
  name: string;

  @Column({ length: 30, nullable: true, comment: '模板描述' })
  description: string;

  @Column({ type: 'longtext', nullable: true, comment: '模板内容' })
  config: string;

  @Column({ type: 'int', nullable: true, default: 1, comment: '模板状态' })
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
}
