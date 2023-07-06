import { Logger } from '@nestjs/common';
import BaseResponse from '../config/base-response-config';

export default class BaseService {
  get paginationSkip(): number {
    return this._paginationSkip;
  }

  set paginationSkip(value: number) {
    this._paginationSkip = value;
  }

  get paginationSize(): number {
    return this._paginationSize;
  }

  set paginationSize(value: number) {
    this._paginationSize = value;
  }

  get paginationPage(): number {
    return this._paginationPage;
  }

  set paginationPage(value: number) {
    this._paginationPage = value;
  }

  get logger(): Logger {
    return this._logger;
  }

  get baseResponse(): BaseResponse {
    return this._baseResponse;
  }

  setPaginationData(query: setDataPageableFunc) {
    this.paginationPage = query.page || 0;
    this.paginationSize = query.size || 10;
    this.paginationSkip = this.paginationPage * this.paginationSize;
  }

  private _baseResponse = new BaseResponse();
  private _logger = new Logger();
  private _paginationPage: number;
  private _paginationSize: number;
  private _paginationSkip: number;
}

interface setDataPageableFunc {
  page: number;
  size: number;
  search?: string;
}
