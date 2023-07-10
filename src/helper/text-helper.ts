import { statusType } from '../utils/status-type';
import { StatusEnum } from '../enum/status-enum';

export class TextHelper {
  public toSlug(data: string) {
    return data.split(' ').join('-').toLowerCase();
  }

  public toLowercaseEnum(data: string) {
    return data.split('_').join('-').toLowerCase();
  }

  public parseSeparateCommaToArrayNumber(data: string): number[] {
    const split = data.split(',');
    return split.map((item) => parseInt(item));
  }

  public checkStatus(status: statusType): StatusEnum {
    switch (status) {
      case 'need-revision':
        return StatusEnum.NEED_REVISION;
      case 'publish':
        return StatusEnum.PUBLISH;
      case 'pending':
        return StatusEnum.PENDING;
      case 'reject':
        return StatusEnum.REJECT;
      case 'draft':
        return StatusEnum.DRAFT;
      default:
        return undefined;
    }
  }
}
