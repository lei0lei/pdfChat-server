import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('conversation_info')
export class conversationItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: "varchar",
    length: 255
  })
  conversation_id: string;

  @Column({
    type: "varchar",
    length: 128
  })
  user_connected: string;

  @Column({ type: 'int2' }) // For int2 type
  seq_id: number;


  @Column('timetz')
  time_created: Date;


  @Column({ type: 'text' })
  quiz: string

  @Column({ type: 'text' })
  answer: string

  @Column('text', {array: true})
  doc_connected: string[]


  @Column({
    type: 'boolean'
  })
  expired: boolean;

}

