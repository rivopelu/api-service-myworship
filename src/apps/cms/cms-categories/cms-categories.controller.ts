import { Controller } from '@nestjs/common';
import { CmsCategoriesService } from '@apps/cms/cms-categories/cms-categories.service';

@Controller('cms/categories')
export class CmsCategoriesController {
  constructor(private categoriesService: CmsCategoriesService) {}
}
