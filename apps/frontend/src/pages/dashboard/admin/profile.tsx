import AdminLayout from "@/components/layout/admin-layout";
import ProfilePage from "@/components/shared-page/profile-page";

// @ts-expect-error

ProfilePage.layout = function (page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProfilePage;
