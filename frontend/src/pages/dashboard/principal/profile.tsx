import StudentLayout from "@/components/layout/student-layout";
import ProfilePage from "@/components/shared-page/profile-page";

// @ts-expect-error
ProfilePage.layout = function (page: any) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default ProfilePage;