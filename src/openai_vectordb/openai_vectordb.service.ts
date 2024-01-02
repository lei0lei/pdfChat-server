import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { openaiVectordbItem } from './openai_vectordb.entity';
import { openaiVectordbRepository } from './openai_vectordb.repository';

@Injectable()
export class openaiVectordbService {
  constructor(
    @InjectRepository(openaiVectordbItem)
    private itemRepository: openaiVectordbRepository,
  ) {}

  insertVectors(items: openaiVectordbItem[]): Promise<openaiVectordbItem[]> {
    return this.itemRepository.save(items);
  }
  async createVectorItem(openaiVectordbItem: openaiVectordbItem) {
    const newopenaiVectordbItem = this.itemRepository.create(openaiVectordbItem);
    await this.itemRepository.save(newopenaiVectordbItem);
  }
  existDocs(doc_id: string) {
    return this.itemRepository.findOne({ where: { doc_id } });
  }

  
}