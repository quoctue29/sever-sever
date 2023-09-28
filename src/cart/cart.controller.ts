import {
  Body,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, PortalController } from '@/decorator';
import { Serialize } from '@/interceptor';
import { CartResDto, CartReqDto, CartQuery } from './dto';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@/auth/guard';
import { IReqUser } from '@/auth/interface';

@ApiTags('Cart')
@PortalController({ path: 'carts' })
export class CartController {
  private readonly logger = new Logger(CartController.name);
  constructor(private cartService: CartService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @Serialize(CartResDto)
  async getCartById(@CurrentUser() payload: IReqUser): Promise<any> {
    return this.cartService.getCartByEmail(payload.email);
  }

  @Get('/')
  async getListCart(@Query() query: CartQuery): Promise<any> {
    this.logger.debug(`Rest to get list category info`);
    return this.cartService.getListCart(query);
  }

  @Put('/add-cart')
  @UseGuards(JwtAuthGuard)
  async addCart(@CurrentUser() payload: IReqUser, @Body() dto: CartReqDto) {
    return this.cartService.addCart(payload, dto);
  }

  @Put('/remove-cart')
  @UseGuards(JwtAuthGuard)
  async removeCart(@CurrentUser() payload: IReqUser, @Body() dto: CartReqDto) {
    return this.cartService.removeCart(payload, dto);
  }
}
