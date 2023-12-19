import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { docItem } from './doc_info.entity';
import { docItemRepository } from './doc_info.repository';

@Injectable()
export class docItemService {
  constructor(
    @InjectRepository(docItem)
    private itemRepository: docItemRepository,
  ) {}

  insertDocs(items: docItem[]): Promise<docItem[]> {
    return this.itemRepository.save(items);
  }
  async createDocItem(docItem: docItem) {
    const newDocItem = this.itemRepository.create(docItem);
    await this.itemRepository.save(newDocItem);
  }
  existDocs(doc_sha256: string) {
    return this.itemRepository.findOne({ where: { doc_sha256 } });
  }

  
}