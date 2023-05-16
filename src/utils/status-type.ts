import { StatusEnum } from '@enum/status-enum';
import { all } from 'axios';

export type statusType =
  | 'publish'
  | 'pending'
  | 'need-revision'
  | 'draft'
  | 'all';

export function parseTypeStatusToEnum(data: statusType): StatusEnum {
  switch (data) {
    case 'draft':
      return StatusEnum.DRAFT;
    case 'need-revision':
      return StatusEnum.NEED_REVISION;
    case 'pending':
      return StatusEnum.PENDING;
    case 'publish':
      return StatusEnum.PUBLISH;
    default:
      return undefined;
  }
}

export function parseEnumStatusToType(data: StatusEnum): statusType {
  switch (data) {
    case StatusEnum.DRAFT:
      return 'draft';
    case StatusEnum.NEED_REVISION:
      return 'need-revision';
    case StatusEnum.PENDING:
      return 'pending';
    case StatusEnum.PUBLISH:
      return 'publish';
    default:
      return undefined;
  }
}
