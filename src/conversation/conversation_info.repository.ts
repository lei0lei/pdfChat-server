import { EntityRepository, Repository } from 'typeorm';
import { conversationItem } from './conversation_info.entity';

@EntityRepository(conversationItem)
export class conversationItemRepository extends Repository<conversationItem> {}