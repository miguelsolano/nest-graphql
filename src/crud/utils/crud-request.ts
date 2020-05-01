import { CrudRequest, RoutesOptions } from '@nestjsx/crud';
import { CrudRequestOptions } from '../options/crud-request';
import { ParamsOptions, RequestQueryParser } from '@nestjsx/crud-request';
import { defaultCrudRoutes, defaultCrudParams } from '../defaults/options';

export function createCrudRequestThunk(
  params: ParamsOptions = defaultCrudParams,
  routes: RoutesOptions = defaultCrudRoutes,
) {
  return (crudOptions: CrudRequestOptions): CrudRequest => {
    const requestBuilder = RequestQueryParser.create();
    requestBuilder.parseQuery(crudOptions.getParseQueryParams());
    if (Object.keys(crudOptions.getSearch()).length) {
      requestBuilder.search = crudOptions.getSearch();
      requestBuilder.filter = [];
    }
    return {
      options: { query: {}, params, routes },
      parsed: requestBuilder.getParsed(),
    };
  };
}
