import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateCategoryDto } from '@dto/request/categories-request/ICreateCategoryDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/User';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import BaseService from '@apps/base-service';
import { Categories } from '@entities/Categories';
import { UtilsHelper } from '@helper/utils-helper';
import { getTransientInstances } from '@nestjs/core/injector/helpers/transient-instances';
import { IPaginationQueryParams } from '@utils/utils-interfaces-type';
import { IListCategoriesResponse } from '@dto/request/response/categories-response/IListCategoriesResponse';
import { ReturnResponsePagination } from '@config/base-response-config';

@Injectable()
export class CmsCategoriesService extends BaseService {
  private utilsHelper = new UtilsHelper();

  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    private jwtService?: JwtService,
  ) {
    super();
  }

  async createCategory(data: ICreateCategoryDto) {
    const checkData = await this.categoriesRepository.findOneBy({
      slug: this.utilsHelper.generateSlug(data.name),
    });
    if (checkData) {
      throw new BadRequestException('Nama Kategory telah ada di database');
    } else {
      const createData = await this.categoriesRepository.save({
        slug: this.utilsHelper.generateSlug(data.name),
        name: data.name,
        description: data.description,
      });
      if (createData) {
        return this.baseResponse.BaseResponseWithMessage(
          'category success created',
        );
      }
    }
  }

  async editCategory(slug: string, data: ICreateCategoryDto) {
    const findData = await this.categoriesRepository.findOneBy({ slug: slug });
    if (!findData) {
      throw new NotFoundException('Category tidak di temukan');
    } else {
      const update = await this.categoriesRepository.update(
        { id: findData.id },
        {
          slug: this.utilsHelper.generateSlug(data.name),
          name: data.name,
          description: data.description,
        },
      );
      if (update) {
        return this.baseResponse.BaseResponseWithMessage('Success Updated');
      }
    }
  }

  async deleteCategory(slug: string) {
    const findData = await this.categoriesRepository.findOneBy({ slug });
    if (!findData) {
      throw new NotFoundException('category tidak ditemukan');
    } else {
      const deleted = await this.categoriesRepository.delete({
        id: findData.id,
      });
      if (deleted) {
        return this.baseResponse.BaseResponseWithMessage('Deleted success');
      }
    }
  }

  async getListCategories(
    param: IPaginationQueryParams,
  ): ReturnResponsePagination<IListCategoriesResponse[]> {
    this.setPaginationData({
      page: param.page,
      size: param.size,
    });
    const [data, count] = await this.categoriesRepository.findAndCount({
      where: {
        name: param?.search ? Like(`%${param.search}%`) : undefined,
      },
    });
    const resData: IListCategoriesResponse[] = data.map((item) => {
      return {
        slug: item.slug,
        name: item.name,
        id: item.id,
      };
    });
    return this.baseResponse.baseResponsePageable<IListCategoriesResponse[]>(
      resData,
      {
        page: this.paginationPage,
        size: this.paginationSize,
        total_data: count,
      },
    );
  }
}
