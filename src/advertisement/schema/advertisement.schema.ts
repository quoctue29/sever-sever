import {
  modelOptions,
  plugin,
  Severity,
  PaginateMethod,
} from '@typegoose/typegoose';
import { prop } from '@typegoose/typegoose';
import * as MongoosePaginate from 'mongoose-paginate-v2';

import { Base } from '../../repository/repository.base';

@plugin(MongoosePaginate)
@modelOptions({
  schemaOptions: {
    collection: 'advertisements',
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Advertisement extends Base {
  constructor(partial: Partial<Advertisement>) {
    super();
    Object.assign(this, partial);
  }

  @prop({ default: false })
  isActive: boolean;

  @prop()
  link: string;

  @prop()
  image: string;

  static paginate: PaginateMethod<Advertisement>;
}
