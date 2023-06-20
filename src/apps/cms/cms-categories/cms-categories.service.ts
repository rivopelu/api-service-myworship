import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateCategoryDto } from '@dto/request/categories-request/ICreateCategoryDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import BaseService from '@apps/base-service';
import { Categories } from '@entities/Categories';
import { UtilsHelper } from '@helper/utils-helper';
import { IPaginationQueryParams } from '@utils/utils-interfaces-type';
import { IListCategoriesResponse } from '@dto/response/categories-response/IListCategoriesResponse';
import {
  ReturnBaseResponse,
  ReturnResponsePagination,
} from '@config/base-response-config';

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
  ): ReturnBaseResponse<IListCategoriesResponse[]> {
    const data = await this.categoriesRepository.find({
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
    return this.baseResponse.BaseResponse<IListCategoriesResponse[]>(resData);
  }

  async getListCategoriesSelectAll() {
    const data = await this.categoriesRepository.find();
    if (data) {
      const res: IListCategoriesResponse[] = data.map((item) => {
        return {
          slug: item.slug,
          name: item.name,
          id: item.id,
        };
      });
      return this.baseResponse.BaseResponse<IListCategoriesResponse[]>(res);
    }
  }
}
