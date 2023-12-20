import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('doc_info')
export class docItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: "varchar",
    length: 128
  })
  doc_name: string;

  @Column({
    type: "varchar",
    length: 512
  })
  doc_url: string;

  @Column('timetz')
  time_created: Date;

  @Column({
    type: 'varchar',
    length: 64
  })
  doc_sha256: string;

  @Column({
    type: 'boolean'
  })
  doc_available: boolean;

  @Column({
    type: "varchar",
    length: 128
  })
  user_belonged: string;

  @Column({
    type: 'varchar',
    length: 128
  })
  doc_type: string;
}

