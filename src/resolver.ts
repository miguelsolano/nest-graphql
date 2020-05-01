import { Type } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { GetManyDefaultResponse } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CrudRequestOptions } from './crud/options/crud-request';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { createCrudRequestThunk } from './crud/utils/crud-request';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GraphQLResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected createRequest: Function;

    protected constructor(
      protected repo: Repository<T>,
      protected service: TypeOrmCrudService<T>,
    ) {
      this.createRequest = createCrudRequestThunk();
    }

    @Query(/* istanbul ignore next */ _ => classRef, {
      name: `${classRef.name.toLocaleLowerCase()}`,
    })
    async findOne(@Args('id') id: string): Promise<T> {
      const crudOptions = new CrudRequestOptions({ id: id });
      return await this.service.getOne(this.createRequest(crudOptions));
    }

    @Query(_ => [classRef], { name: `${classRef.name.toLocaleLowerCase()}s` })
    async findAll(
      @Args('crud') crud: object,
    ): Promise<GetManyDefaultResponse<T> | T[]> {
      const crudOptions = new CrudRequestOptions(crud);
      return await this.service.getMany(this.createRequest(crudOptions));
    }

    @Mutation(/* istanbul ignore next */ _ => classRef, {
      name: `create${classRef.name.toLocaleLowerCase()}`,
    })
    async create(@Args('data') data: DeepPartial<T>): Promise<T> {
      const crudOptions = new CrudRequestOptions(null);
      return await this.service.createOne(
        this.createRequest(crudOptions),
        data,
      );
    }

    @Mutation(/* istanbul ignore next */ _ => classRef, {
      name: `update${classRef.name.toLocaleLowerCase()}`,
    })
    async update(
      @Args('id') id: string,
      @Args('data') data: DeepPartial<T>,
    ): Promise<T> {
      const crudOptions = new CrudRequestOptions({ id: id });
      return await this.service.updateOne(
        this.createRequest(crudOptions),
        data,
      );
    }

    @Mutation(/* istanbul ignore next */ _ => classRef, {
      name: `delete${classRef.name.toLocaleLowerCase()}`,
    })
    async delete(@Args('id') id: string): Promise<string> {
      const crudOptions = new CrudRequestOptions({ id: id });
      await this.service.deleteOne(this.createRequest(crudOptions));
      return id;
    }
  }
  return BaseResolver;
}
