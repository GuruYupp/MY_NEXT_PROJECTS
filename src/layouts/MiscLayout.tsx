import ParentalControl from "@/components/ParentalControl/ParentalControl";
import ChangePassword from "@/components/changepassword/ChangePassword";
import EditProfile from "@/components/editprofile/EditProfile";
import ForgotPassword from "@/components/forgotpassword/ForgotPassword";
import Settings from "@/components/settings/Settings";
import { useRouter } from "next/router";

function MiscLayout(): JSX.Element {
  const { asPath } = useRouter();
  return (
    <>
      {asPath === "/settings" && (
        <div style={{ minHeight: "80vh" }}>
          <Settings />
        </div>
      )}
      {asPath === "/settings/edit-profile" && (
        <div style={{ minHeight: "80vh" }}>
          <EditProfile />
        </div>
      )}
      {asPath === "/settings/parental-profile" && (
        <div style={{ minHeight: "80vh" }}>
          <ParentalControl />
        </div>
      )}
      {asPath == "/change-password" && (
        <div style={{ minHeight: "80vh" }}>
          <ChangePassword />
        </div>
      )}
      {asPath == "/forgot-password" && (
        <div style={{ minHeight: "80vh" }}>
          <ForgotPassword />
        </div>
      )}
    </>
  );
}

export default MiscLayout;
