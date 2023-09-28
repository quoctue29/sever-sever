import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryProvider } from '@/repository';
import { ServerMessage, SortEnum, StatisticalEnum } from '@/common';
import { IReqUser } from '@/auth/interface';
import {
  OrderResDto,
  OrderReqDto,
  OrderQuery,
  updateStatusOrder,
  StatisticalOrderQuery,
  OrderHistoryQuery,
} from './dto';
import { CartService } from '@/cart/cart.service';
import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    private repository: RepositoryProvider,
    private cartService: CartService,
  ) {}
  private readonly name = 'Order';

  public async getOrderById(id: string): Promise<any> {
    const order = await this.repository.Order.findById(id);
    if (_.isNil(order))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return order;
  }

  public async createOrder(payload: IReqUser, dto: OrderReqDto) {
    const cart = await this.cartService.getCartByEmail(payload.email);
    const order = await this.repository.Order.create({
      email: payload.email,
      cart: cart.productIds.filter((v) => v.IsSelected === true),
      totalProduct: cart.totalProduct,
      totalPrice: cart.totalPrice,
      ...dto,
    });
    await this.cartService.resetCart(payload);
    return order;
  }

  public async updateOrder(dto: OrderReqDto, id: string): Promise<any> {
    const order = await this.repository.Order.findOneAndUpdate(
      { _id: id },
      dto,
      { new: true },
    ).exec();
    if (!order)
      throw new NotFoundException(`${this.name}${ServerMessage.NOT_FOUND}`);
    return order;
  }

  public async updateStatusOrder(
    dto: updateStatusOrder,
    id: string,
  ): Promise<any> {
    const order = await this.repository.Order.findOneAndUpdate(
      { _id: id },
      dto,
      { new: true },
    ).exec();
    if (!order)
      throw new NotFoundException(`${this.name}${ServerMessage.NOT_FOUND}`);
    return order;
  }

  public async deleteOrder(payload: IReqUser, id: string) {
    const order = await this.repository.Order.findOneAndDelete({
      _id: id,
      email: payload.email,
    }).exec();
    if (!order) throw new NotFoundException(ServerMessage.INVALID_PERMISSION);
    return { msg: this.name.concat(ServerMessage.WAS_DELETED) };
  }

  public async getListOrder(query: OrderQuery) {
    const filter = {
      ...(_.isString(query.email)
        ? { email: { $regex: `${query.email}`, $options: 'i' } }
        : {}),
      ...(_.isString(query.recipientName)
        ? { recipientName: { $regex: `${query.recipientName}`, $options: 'i' } }
        : {}),
      ...(_.isString(query.phone)
        ? { phone: { $regex: `${query.phone}`, $options: 'i' } }
        : {}),
      ...(_.isString(query.status)
        ? { status: { $regex: `${query.status}`, $options: 'i' } }
        : {}),
    };
    const option = {
      page: _.defaultTo(query.page, 1),
      limit: _.defaultTo(query.limit, 10),
      sort: {
        ...(!_.isNil(query.sortCreatedAt) &&
        [SortEnum.ASC, SortEnum.DESC].includes(Number(query.sortCreatedAt))
          ? { createdAt: Number(query.sortCreatedAt) }
          : {}),
      },
    };
    const { docs, totalDocs, totalPages } =
      await this.repository.Order.paginate(filter, option);

    return {
      docs: docs.map((doc) => new OrderResDto(doc.toObject())),
      totalDocs,
      totalPages,
    };
  }

  public async historyOrder(payload: IReqUser, query: OrderHistoryQuery) {
    const filter = {
      ...(_.isString(payload.email) ? { email: payload.email } : {}),
    };
    const option = {
      page: _.defaultTo(query.page, 1),
      limit: _.defaultTo(query.limit, 10),
      sort: {
        ...(!_.isNil(query.sortCreatedAt) &&
        [SortEnum.ASC, SortEnum.DESC].includes(Number(query.sortCreatedAt))
          ? { createdAt: Number(query.sortCreatedAt) }
          : {}),
      },
    };
    const { docs, totalDocs, totalPages } =
      await this.repository.Order.paginate(filter, option);

    return {
      docs: docs.map((doc) => new OrderResDto(doc.toObject())),
      totalDocs,
      totalPages,
    };
  }

  public async getStatisticalOrder(query: StatisticalOrderQuery) {
    const typeStatistical = query.statisticalBy;
    const status = query.status;
    let today = new Date();
    let startDay: any, endDay: any;

    switch (typeStatistical) {
      case StatisticalEnum.TODAY:
        startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
        );
        endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
        );
        break;
      case StatisticalEnum.WEEK:
        startDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
        );
        endDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
        );
        break;
      case StatisticalEnum.MONTH:
        startDay = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
        endDay = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
        break;
      case StatisticalEnum.YEAR:
        startDay = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
        endDay = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
        break;
      default:
        break;
    }

    const order: Order[] = await this.repository.Order.find({
      $and: [
        {
          createdAt: { $gte: startDay, $lte: endDay },
          status: status,
        },
      ],
    });

    return {
      order: order,
      total: order.length,
    };
  }
}
