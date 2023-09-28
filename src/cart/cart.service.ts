import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryProvider } from '@/repository';
import { ServerMessage, SortEnum } from '@/common';
import { Cart } from './schema/cart.schema';
import { CartResDto, CartReqDto, CartQuery, ListProductReq } from './dto';
import { IReqUser } from '@/auth/interface';
import { ProductsService } from '@/products/products.service';

@Injectable()
export class CartService {
  constructor(
    private repository: RepositoryProvider,
    private productsService: ProductsService,
  ) {}
  private readonly name = 'Cart';

  public async getCartById(id: string): Promise<any> {
    const cart: Cart = await this.repository.Cart.findById(id);
    if (_.isNil(cart))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return cart;
  }

  public async getCartByEmail(email: string) {
    const cart = await this.repository.Cart.findOne({ email: email }).lean();
    if (_.isNil(cart))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return cart;
  }

  public async addCart(payload: IReqUser, dto: CartReqDto) {
    let totalAmount: number = 0;
    let totalPrice: number = 0;
    const productUser = await this.repository.Cart.findOne({
      email: payload.email,
    }).lean();
    const products = [...productUser.productIds, ...dto.productIds].reduce(
      (accumulator, current) => {
        const existingItem = accumulator.find(
          (item) => item.productId === current.productId,
        );
        if (existingItem) {
          existingItem.amount += current.amount;
          existingItem.IsSelected = current.IsSelected;
        } else {
          accumulator.push(current);
        }

        return accumulator;
      },
      [],
    );
    for (const product of products) {
      const book = await this.productsService.getProductById(product.productId);
      product.unitPrice = book.price;
      if (product.IsSelected === false) continue;
      totalAmount += product.amount;
      totalPrice += product.amount * book.price;
    }

    const cart = await this.repository.Cart.findOneAndUpdate(
      { email: payload.email },
      {
        totalProduct: totalAmount,
        totalPrice: totalPrice,
        productIds: products,
      },
      { new: true },
    ).lean();

    if (_.isNil(cart))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return cart;
  }

  public async removeCart(payload: IReqUser, dto: CartReqDto) {
    const productUser = await this.repository.Cart.findOne({
      email: payload.email,
    }).lean();

    const products = productUser.productIds.filter((item1) => {
      const existsInProductReq = dto.productIds.some(
        (item2) => item2.productId === item1.productId,
      );
      return !existsInProductReq;
    });

    const cart = await this.repository.Cart.findOneAndUpdate(
      { email: payload.email },
      { productIds: products },
      { new: true },
    ).lean();

    if (_.isNil(cart))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return cart;
  }

  public async resetCart(payload: IReqUser) {
    let totalAmount: number = 0;
    let totalPrice: number = 0;
    let newListProduct = [];
    const cart = await this.repository.Cart.findOne({
      email: payload.email,
    }).lean();
    newListProduct = cart.productIds.filter((v) => v.IsSelected === false);
    if (cart.productIds.length === 0) {
      totalAmount = 0;
      totalPrice = 0;
    }
    const res = await this.repository.Cart.findOneAndUpdate(
      { email: payload.email },
      {
        productIds: newListProduct,
        totalPrice: totalPrice,
        totalProduct: totalAmount,
      },
      { new: true },
    ).lean();
    return res;
  }

  public async getListCart(query: CartQuery) {
    const filter = {
      ...(_.isString(query.email)
        ? { email: { $regex: `${query.email}`, $options: 'i' } }
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
    const { docs, totalDocs, totalPages } = await this.repository.Cart.paginate(
      filter,
      option,
    );

    return {
      docs: docs.map((doc) => new CartResDto(doc.toObject())),
      totalDocs,
      totalPages,
    };
  }
}
