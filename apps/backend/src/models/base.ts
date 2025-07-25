import { InitOptions, Model, ModelStatic } from "sequelize";
import sequelize from "~/database/sequelize";
import { PaginationResult } from "~/types/pagination";
import {
  findAndPaginate,
  FindAndPaginateProps,
} from "~/utils/query/find-and-paginate";

export class BaseModel<
  TModelAttributes extends {},
  TCreationAttributes extends {},
> extends Model<TModelAttributes, TCreationAttributes> {
  static async paginate<T extends BaseModel<any, any>>(
    this: ModelStatic<T>,
    props: FindAndPaginateProps,
  ): Promise<PaginationResult<T>> {
    return findAndPaginate(this, props);
  }
}

export const baseInit: InitOptions = {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
};
