import {
  modelOptions,
  plugin,
  Severity,
  PaginateMethod,
} from '@typegoose/typegoose';
import { prop } from '@typegoose/typegoose';
import * as MongoosePaginate from 'mongoose-paginate-v2';

import { Base } from '@/repository';
import { statusOrder } from '@/common';
import { CartReqDto } from '@/cart/dto';

@plugin(MongoosePaginate)
@modelOptions({
  schemaOptions: {
    collection: 'orders',
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Order extends Base {
  constructor(partial: Partial<Order>) {
    super();
    Object.assign(this, partial);
  }

  @prop()
  cart: CartReqDto[];

  @prop()
  totalProduct: number;

  @prop()
  totalPrice: number;

  @prop()
  recipientName: string;

  @prop()
  email: string;

  @prop()
  phone: string;

  @prop()
  province: string;

  @prop()
  district: string;

  @prop()
  wards: string;

  @prop()
  address: string;

  @prop({ default: statusOrder.IN_PROGRESS })
  status: statusOrder;

  static paginate: PaginateMethod<Order>;
}
