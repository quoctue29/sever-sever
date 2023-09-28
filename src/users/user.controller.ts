import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, PortalController, Roles } from '@/decorator';
import { Serialize } from '@/interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '@/auth/guard';
import { IReqUser } from '@/auth/interface';
import { Role } from '@/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  SetRoleDto,
  StatisticalUserQuery,
  UpdateUserInfoDto,
  UserInfoDto,
  UserQuery,
} from './dto';

@ApiTags('User')
@PortalController({ path: 'user' })
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get('/user-info/me')
  @Serialize(UserInfoDto)
  @UseGuards(JwtAuthGuard)
  public async get(@CurrentUser() payload: IReqUser): Promise<UserInfoDto> {
    this.logger.debug(`Rest to get user info > email: ${payload.email}`);
    return this.userService.getUserById(payload.id);
  }

  @Get('/')
  @UseInterceptors(CacheInterceptor)
  public async getListUser(@Query() query: UserQuery): Promise<any> {
    this.logger.debug(`Rest to get list user info`);
    return this.userService.getListUser(query);
  }

  @Get('/statistical')
  // @UseInterceptors(CacheInterceptor)
  public async getStatisticalUser(
    @Query() query: StatisticalUserQuery,
  ): Promise<any> {
    this.logger.debug(`Rest to get list user info`);
    return this.userService.getStatisticalUser(query);
  }

  @Put('/update-user-info/')
  @Serialize(UserInfoDto)
  @UseGuards(JwtAuthGuard)
  public async updateUserInfo(
    @CurrentUser() payload: IReqUser,
    @Body() dto: UpdateUserInfoDto,
  ): Promise<UserInfoDto> {
    this.logger.debug(`Rest to update user info: ${payload.id}`);
    return this.userService.updateUserInfo(payload.id, dto);
  }

  @Put('/change-password/')
  @Serialize(UserInfoDto)
  @UseGuards(JwtAuthGuard)
  public async changePassWord(
    @CurrentUser() payload: IReqUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<UserInfoDto> {
    this.logger.debug(`Rest to update user info: ${payload.id}`);
    return this.userService.changePassword(payload.id, dto);
  }

  @Put('/set-role/:id')
  @Serialize(UserInfoDto)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN)
  public async setRoleUser(
    @Param('id') id: string,
    @Body() payload: SetRoleDto,
  ): Promise<UserInfoDto> {
    this.logger.debug(`Rest to set role for user id: ${id}`);
    return this.userService.updateRoles(id, payload);
  }

  @Get('/:uid')
  @Serialize(UserInfoDto)
  public async getUserByUid(@Param('uid') uid: string): Promise<UserInfoDto> {
    this.logger.debug(`Rest to get user by id ${uid}`);
    return this.userService.getUserByUuid(uid);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN)
  public async deleteUser(@Param('id') id: string) {
    this.logger.debug(`Rest to delete user by id: ${id}`);
    return this.userService.deleteUser(id);
  }
}
