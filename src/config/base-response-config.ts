import { HttpStatus } from '@nestjs/common';
import { MessageResponseEnum } from '../enum/message-response-enum';
import { setDataPageable } from '../utils/utils-interfaces-type';

export default class BaseResponse {
  public BaseResponse<T>(data: T, code?: HttpStatus): IBaseResponse<T> {
    return {
      success: true,
      status_code: code ?? HttpStatus.OK,
      status_message: MessageResponseEnum.SUCCESS,
      response_data: data,
    };
  }

  public baseResponsePageable<T>(
    data: T,
    pageable: setDataPageable,
  ): IBaseResponsePageable<T> {
    return {
      success: true,
      status_code: 200,
      status_message: MessageResponseEnum.SUCCESS,
      pagination_data: {
        page:
          typeof pageable.page === 'string'
            ? parseInt(pageable.page)
            : pageable.page,
        size:
          typeof pageable.size === 'string'
            ? parseInt(pageable.size)
            : pageable.size,
        total_data:
          typeof pageable.total_data === 'string'
            ? parseInt(pageable.total_data)
            : pageable.total_data,
      },
      response_data: data,
    };
  }

  public BaseResponseWithMessage(
    message: string,
    code?: HttpStatus,
  ): IBaseResponseWithMessage {
    return {
      success: true,
      message: message ?? 'SUCCESS',
      status_code: code ?? HttpStatus.OK,
      status_message: MessageResponseEnum.SUCCESS,
    };
  }
}

export interface IBaseResponse<T> {
  success: boolean;
  status_code: HttpStatus;
  status_message: MessageResponseEnum;
  response_data: T;
}

export interface IBaseResponseWithMessage {
  success: boolean;
  status_code: HttpStatus;
  status_message: MessageResponseEnum;
  message: string;
}

interface IBaseResponsePageable<T> extends IBaseResponse<T> {
  pagination_data: setDataPageable;
}

export type ReturnBaseResponse<T> = Promise<IBaseResponse<T>>;
export type ReturnResponseWithMessage = Promise<IBaseResponseWithMessage>;
export type ReturnResponsePagination<T> = Promise<IBaseResponsePageable<T>>;
