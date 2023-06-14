import { StatusEnum } from '@enum/status-enum';

export type statusType =
  | 'publish'
  | 'pending'
  | 'need-revision'
  | 'draft'
  | 'reject'
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
    case 'reject':
      return StatusEnum.REJECT;
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
    case StatusEnum.REJECT:
      return 'reject';
    default:
      return undefined;
  }
}
