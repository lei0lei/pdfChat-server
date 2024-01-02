import { EntityRepository, Repository } from 'typeorm';
import { openaiVectordbItem } from './openai_vectordb.entity';

@EntityRepository(openaiVectordbItem)
export class openaiVectordbRepository extends Repository<openaiVectordbItem> {}