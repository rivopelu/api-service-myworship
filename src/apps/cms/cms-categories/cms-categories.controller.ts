import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CmsCategoriesService } from '@apps/cms/cms-categories/cms-categories.service';
import { ICreateCategoryDto } from '@dto/request/categories-request/ICreateCategoryDto';
import { SuperAdminGuard } from '@guard/super-admin.guard';
import { AdminGuard } from '@guard/admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CMS CATEGORIES CONTROLLER')
@Controller('cms/categories')
export class CmsCategoriesController {
  constructor(private categoriesService: CmsCategoriesService) {}

  @UseGuards(SuperAdminGuard)
  @Post('v1/new')
  createCategory(@Body() data: ICreateCategoryDto) {
    return this.categoriesService.createCategory(data);
  }

  @UseGuards(AdminGuard)
  @Get('v1/list')
  getListCategories(@Query('search') search: string) {
    return this.categoriesService.getListCategories({ search });
  }

  @UseGuards(SuperAdminGuard)
  @Put('v1/edit/:slug')
  editCategory(@Body() data: ICreateCategoryDto, @Param('slug') slug: string) {
    return this.categoriesService.editCategory(slug, data);
  }

  @UseGuards(SuperAdminGuard)
  @Delete('v1/delete/:slug')
  deleteCategory(@Param('slug') slug: string) {
    return this.categoriesService.deleteCategory(slug);
  }

  @UseGuards(AdminGuard)
  @Get('/v1/list-select')
  getListSelectCategories() {
    return this.categoriesService.getListCategoriesSelectAll();
  }
}
