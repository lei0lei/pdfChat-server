import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { conversationItem } from './conversation_info.entity';
import { conversationItemRepository } from './conversation_info.repository';

@Injectable()
export class conversationItemService {
  constructor(
    @InjectRepository(conversationItem)
    private itemRepository: conversationItemRepository,
  ) {}

  insertDocs(items: conversationItem[]): Promise<conversationItem[]> {
    return this.itemRepository.save(items);
  }
  async createDocItem(conversationItem: conversationItem) {
    const newConversationItem = this.itemRepository.create(conversationItem);
    await this.itemRepository.save(newConversationItem);
  }
  existDocs(conversation_id: string) {
    return this.itemRepository.findOne({ where: { conversation_id } });
  }

  
}