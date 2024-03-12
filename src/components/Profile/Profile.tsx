import { useRouter } from "next/router";
import SelectUserProfiles from "./selectuserprofiles/SelectUserProfile";
import ManageUserProfiles from "./manageprofiles/ManageProfiles";
import UpdateuserProfile from "./updateuserprofile/UpdateuserProfile";
import CreateUserProfile from "./createuserProfile/CreateUserProfile";
import AddProfile from "./addProfilename/AddProfileName";

export default function Profiles() {
  const router = useRouter();
  if (router.asPath === "/profiles/select-user-profile") {
    return <SelectUserProfiles />;
  }
  if (router.asPath === "/profiles/manage-user-profile") {
    return <ManageUserProfiles />;
  }
  if (router.asPath === "/add-profile-name") {
    return <AddProfile />;
  }
  if (router.asPath.includes("/profiles/update-user-profile/")) {
    return <UpdateuserProfile />;
  }
  if (router.asPath.includes("/profiles/create-user-profile")) {
    return <CreateUserProfile />;
  }
  return <></>;
}
