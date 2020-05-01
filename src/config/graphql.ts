import { GraphQLConfig } from './interfaces/config.interface';

const config = {
  debug: true,
  playground: true,
  installSubscriptionHandlers: false,
  typePaths: [],
};

export const configFn = ({
  debug,
  playground,
  typePaths,
}: GraphQLConfig): any => {
  return Object.assign({}, config, { debug, playground, typePaths });
};
