import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RepositoryProvider } from '@/repository';
import { CachingService } from '@/caching';
import { Role, ServerMessage, SortEnum, StatisticalEnum } from '@/common';
import { getKeyEnum, isValidObjectId } from '@/utils';
import { User } from './schema/user.schema';
import {
  ChangePasswordDto,
  SetRoleDto,
  StatisticalUserQuery,
  UpdateUserInfoDto,
  UserInfoDto,
  UserQuery,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private repository: RepositoryProvider,
    private cacheManager: CachingService,
  ) {}
  private readonly name = 'User';

  public async getUserById(id: string): Promise<UserInfoDto> {
    isValidObjectId(id);
    const user: User = await this.repository.User.findById(id);
    if (_.isNil(user))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return user;
  }

  public async getUserByUuid(uid: string) {
    const user: User = await this.repository.User.findOne({ uuid: uid }).lean();
    if (_.isNil(user))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return user;
  }

  public async getListUser(query: UserQuery): Promise<any> {
    const filter = {
      ...(_.isString(query.email)
        ? { email: { $regex: `${query.email}`, $options: 'i' } }
        : {}),
      ...(_.isString(query.userName)
        ? { userName: { $regex: `${query.userName}`, $options: 'i' } }
        : {}),
      ...(_.isString(query.fullName)
        ? { fullName: { $regex: `${query.fullName}`, $options: 'i' } }
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
    const { docs, totalDocs, totalPages } = await this.repository.User.paginate(
      filter,
      option,
    );
    return {
      docs: docs.map((doc) => new UserInfoDto(doc.toObject())),
      totalDocs,
      totalPages,
    };
  }

  public async updateRoles(id: string, dto: SetRoleDto): Promise<UserInfoDto> {
    isValidObjectId(id);
    const setRole = [];
    for (let index = 0; index < dto.roles.length; index++) {
      const value = getKeyEnum(Role, dto.roles[index]);
      setRole.push(value);
    }
    const user: User = await this.repository.User.findOneAndUpdate(
      { _id: id },
      { roles: setRole },
      { new: true },
    ).lean();
    if (_.isNil(user))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    await this.cacheManager.reset();
    return user;
  }

  public async updateUserInfo(
    id: string,
    dto: UpdateUserInfoDto,
  ): Promise<UserInfoDto> {
    const user: User = await this.repository.User.findOneAndUpdate(
      { _id: id },
      dto,
      { new: true },
    );
    await this.cacheManager.reset();
    return user;
  }

  public async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<UserInfoDto> {
    isValidObjectId(id);
    if (dto.oldPassWord === dto.newPassWord)
      throw new BadRequestException(ServerMessage.NEW_PASSWORD_BE_OLD_PASSWORD);
    const userExist = await this.repository.User.findOne({ _id: id }).lean();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const isPasswordMatch = await bcrypt.compare(
      dto.oldPassWord,
      userExist.password,
    );
    if (!isPasswordMatch)
      throw new ForbiddenException(ServerMessage.INCORRECT_PASSWORD);
    const hashedPassword = await bcrypt.hash(dto.newPassWord, salt);
    const user: User = await this.repository.User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );
    await this.cacheManager.reset();
    return user;
  }

  public async deleteUser(id: string) {
    await this.getUserById(id);
    await this.repository.User.findByIdAndDelete(id);
    await this.cacheManager.reset();
    return { msg: this.name.concat(ServerMessage.WAS_DELETED) };
  }

  public async getStatisticalUser(query: StatisticalUserQuery) {
    const typeStatistical = query.statisticalBy;
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

    const user: User[] = await this.repository.User.find({
      createdAt: { $gte: startDay, $lte: endDay },
    });

    return {
      user,
      total: user.length,
    };
  }
}
