import { UserModel } from "./user";
import { PermissionModel } from "./permission";
import { PermissionableModel } from "./permissionable";
import { AcademicYearModel } from "./academic_year";
import { ClassroomModel } from "./classroom";
import { ClassroomMemberModel } from "./classroom_member";
import { PasswordResetModel } from "./password_resets";
import { RoleModel } from "./role";
import { StudentModel } from "./student";
import { SubjectModel } from "./subject";
import { TeacherModel } from "./teacher";
import { TokenBlacklistModel } from "./token_blacklist";

// Init model
AcademicYearModel.initModel();
ClassroomModel.initModel();
ClassroomMemberModel.initModel();
PasswordResetModel.initModel();
PermissionModel.initModel();
PermissionableModel.initModel();
RoleModel.initModel();
StudentModel.initModel();
SubjectModel.initModel();
TeacherModel.initModel();
TokenBlacklistModel.initModel();
UserModel.initModel();

// Model associate
AcademicYearModel.associate();
ClassroomModel.associate();
ClassroomMemberModel.associate();
PasswordResetModel.associate();
PermissionModel.associate();
PermissionableModel.associate();
RoleModel.associate();
StudentModel.associate();
SubjectModel.associate();
TeacherModel.associate();
TokenBlacklistModel.associate();
UserModel.associate();

export * from "./academic_year";
export * from "./classroom";
export * from "./classroom_member";
export * from "./password_resets";
export * from "./permission";
export * from "./permissionable";
export * from "./role";
export * from "./student";
export * from "./subject";
export * from "./teacher";
export * from "./token_blacklist";
export * from "./user";
