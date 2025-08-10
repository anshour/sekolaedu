import { PaginationParams, PaginationResult } from "~/types/pagination";
import {
  ClassroomModel,
  StudentAttribute,
  StudentModel,
  UserModel,
} from "~/models";
import buildWhereQuery from "~/utils/query/build-where-query";
import { Op } from "sequelize";
import buildOrderQuery from "~/utils/query/build-order-query";

class StudentService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<StudentAttribute>> {
    const whereQuery = buildWhereQuery(params.filter, {
      search: (value) => ({
        [Op.or]: [
          { "$user.name$": { [Op.iLike]: `%${value}%` } },
          { identification_number: { [Op.iLike]: `%${value}%` } },
        ],
      }),
      user_name: (value) => ({ "$user.name$": { [Op.iLike]: `%${value}%` } }),
      current_classroom_id: (value) => ({ [Op.eq]: value }),
    });

    const orderQuery = buildOrderQuery(params.sort);

    const stduents = await StudentModel.paginate({
      page: params.page,
      limit: params.limit,
      order: orderQuery,
      where: whereQuery,
      include: [
        {
          model: UserModel,
          as: "user",
          required: true,
        },
        {
          model: ClassroomModel,
          as: "current_classroom",
          required: false,
        },
      ],
    });

    return stduents;
  }

  static async createFromUser(userId: number): Promise<StudentAttribute> {
    const newStudent = await StudentModel.create({
      user_id: userId,
      status: "active",
      current_classroom_id: null,
    });

    return newStudent;
  }
}

export default StudentService;
