import { RoutesOptions } from '@nestjsx/crud';
import { ParamsOptions } from '@nestjsx/crud-request';

export const defaultCrudParams: ParamsOptions = {};

export const defaultCrudRoutes: RoutesOptions = {
  getManyBase: {},
  getOneBase: {},
  createOneBase: {},
  createManyBase: {},
  updateOneBase: {},
  replaceOneBase: {},
  deleteOneBase: {},
  exclude: ['createManyBase', 'replaceOneBase'],
};
