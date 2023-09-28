import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as provinces from './provinces.type';
import { DistrictQuery, ProvinceQuery } from './dto/locality-req.dto';

@Injectable()
export class LocalityService {
  private readonly logger = new Logger(LocalityService.name);

  async getProvince(query: ProvinceQuery) {
    const data = provinces.provinces.map((v) => v.name);
    if (query.itemsPerPage && query.currentPage) {
      const province = provinces.provinces.filter((v) => {
        const regex = new RegExp(query.province, 'i'); // 'i' flag for case-insensitive matching
        return regex.test(v.name);
      });
      const data = province.map((v) => v.name);
      // Tính chỉ mục bắt đầu và kết thúc của mảng con
      const startIndex = (query.currentPage - 1) * query.itemsPerPage;
      const endIndex = startIndex + query.itemsPerPage;

      // Trích xuất dữ liệu từ mảng gốc để hiển thị trên trang hiện tại
      const currentPageData = data.slice(startIndex, endIndex);

      return {
        data: currentPageData,
        total: data.length,
      };
    }

    return {
      data: data,
      total: data.length,
    };
  }

  async getDistrict(query: ProvinceQuery) {
    const province = provinces.provinces.find((v) => v.name === query.province);
    if (!province) throw new NotFoundException('Province not found');
    const data = province.districts.map((v) => v.name);

    if (query.itemsPerPage && query.currentPage) {
      const startIndex = (query.currentPage - 1) * query.itemsPerPage;
      const endIndex = startIndex + query.itemsPerPage;
      const currentPageData = data.slice(startIndex, endIndex);
      return {
        data: currentPageData,
        total: data.length,
      };
    }

    return {
      data: data,
      total: data.length,
    };
  }

  async getWard(query: DistrictQuery) {
    const province = provinces.provinces.find((v) => v.name === query.province);
    if (!province) throw new NotFoundException('Province not found');
    const district = province.districts.find((v) => v.name === query.district);
    if (!district) throw new NotFoundException('District not found');
    const data = district.wards.map((v) => v.name);
    if (query.itemsPerPage && query.currentPage) {
      const startIndex = (query.currentPage - 1) * query.itemsPerPage;
      const endIndex = startIndex + query.itemsPerPage;
      const currentPageData = data.slice(startIndex, endIndex);
      return {
        data: currentPageData,
        total: data.length,
      };
    }

    return {
      data: data,
      total: data.length,
    };
  }
}
