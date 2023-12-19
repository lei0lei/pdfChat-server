import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
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
    length: 128
  })
  doc_url: string;

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
    length: 4
  })
  doc_type: string;
}

