import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'server' })
export class Server {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', comment: '服务器名' })
  name: string;
}
