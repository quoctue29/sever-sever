import { RepositoryProvider } from '@/repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Advertisement } from './schema/advertisement.schema';
import { ServerMessage, SortEnum } from '@/common';
import {
  AdvertisementActive,
  AdvertisementReqDto,
  AdvertisementResDto,
} from './dto';
import { AdvertisementQuery } from './dto/advertisement-query.dto';
import { plainToClass } from 'class-transformer';

type NewType = AdvertisementActive;

@Injectable()
export class AdvertisementService {
  constructor(private repository: RepositoryProvider) {}
  private readonly name = 'Advertisement';

  async getAdvertisementById(id: string): Promise<AdvertisementResDto> {
    const adv: Advertisement = await this.repository.Advertisement.findById(id);
    if (!adv)
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return adv;
  }

  async createAdvertisement(
    dto: AdvertisementReqDto,
  ): Promise<AdvertisementResDto> {
    const adv: Advertisement = await this.repository.Advertisement.findOne({
      link: dto.link,
    });
    if (!_.isNil(adv))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    const res: Advertisement = await this.repository.Advertisement.create(dto);
    return res;
  }

  async updateAdvertisement(
    dto: AdvertisementReqDto,
    id: string,
  ): Promise<AdvertisementResDto> {
    const adv = await this.repository.Advertisement.findOneAndUpdate(
      { _id: id },
      dto,
      { new: true },
    ).lean();
    if (_.isNil(adv))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return adv;
  }

  async isActive(
    dto: AdvertisementActive,
    id: string,
  ): Promise<AdvertisementResDto> {
    const adv = await this.repository.Advertisement.findOneAndUpdate(
      { _id: id },
      dto,
      { new: true },
    ).lean();
    if (_.isNil(adv))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return adv;
  }

  async deleteAdvertisement(id: string) {
    const adv = await this.repository.Advertisement.findByIdAndDelete(id);
    if (_.isNil(adv))
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    return { msg: this.name.concat(ServerMessage.WAS_DELETED) };
  }

  public async getListAdvertisement(query: AdvertisementQuery): Promise<any> {
    const filter = {};
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
      await this.repository.Advertisement.paginate(filter, option);

    return {
      docs: docs.map((doc) => new AdvertisementResDto(doc.toObject())),
      totalDocs,
      totalPages,
    };
  }
}
