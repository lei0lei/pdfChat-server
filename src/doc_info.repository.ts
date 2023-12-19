import { EntityRepository, Repository } from 'typeorm';
import { docItem } from './doc_info.entity';

@EntityRepository(docItem)
export class docItemRepository extends Repository<docItem> {}