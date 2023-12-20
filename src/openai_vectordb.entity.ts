import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('openai_vectordb')
export class openaiVectordbItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: "varchar",
    length: 64
  })
  doc_id: string;

  @Column({
    type: "varchar",
    length: 32
  })
  model: string;

  @Column('timetz')
  time_created: Date;

  @Column({ type: 'text' })
  doc_string: string

  @Column("double precision", { array: true })
  vector: number[];

  @Column('json')
  loc: any;
}

