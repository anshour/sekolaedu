import { PaginationParams, PaginationResult } from "~/types/pagination";
import { TeacherAttribute, TeacherModel } from "~/models";
import buildOrderQuery from "~/utils/query/build-order-query";
import buildWhereQuery from "~/utils/query/build-where-query";
import { Op } from "sequelize";

class TeacherService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<TeacherAttribute>> {
    const whereQuery = buildWhereQuery(params.filter, {
      name: (value) => ({ "$user.name$": { [Op.iLike]: `%${value}%` } }),
    });

    const orderQuery = buildOrderQuery(params.sort);

    const data = await TeacherModel.paginate({
      page: params.page,
      limit: params.limit,
      order: orderQuery,
      where: whereQuery,
    });

    return data;
  }

  static async createFromUser(userId: number): Promise<TeacherAttribute> {
    const newTeacher = await TeacherModel.create(
      {
        user_id: userId,
        type: "regular",
      },
      { raw: true },
    );

    return newTeacher;
  }

  static async getByUserId(userId: number): Promise<TeacherAttribute | null> {
    const teacher = await TeacherModel.findOne({
      where: { user_id: userId },
      raw: true,
    });

    return teacher;
  }
}

export default TeacherService;
