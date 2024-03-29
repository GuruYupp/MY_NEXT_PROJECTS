import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { default as clientCookie } from "js-cookie";
import {
  fetchPagedata,
  resetPagestate,
} from "@/redux/feature/pageSlice/pageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

function useGetPage() {
  const { asPath } = useRouter();
  const dispatch = useAppDispatch();
  const { activeProfile } = useAppSelector((state) => state.user);
  useEffect(
    function () {
      // console.log('hello....')
      let arr = asPath.split("/");
      arr.shift();
      if (asPath.indexOf("search") > -1) {
        arr = [arr.join("").split("?")[0]];
      }
      let targetPath = arr.join("/") == "" ? "home" : arr.join("/");
      let params = {
        path: targetPath,
        count: 40,
      };

      document.body.scrollTop = 0;
      const promise = dispatch(fetchPagedata({ params }));

      promise
        .unwrap()
        .then((response) => {
          if (response?.status == false && response?.error?.code == 401) {
            clientCookie.remove("boxId");
            clientCookie.remove("tenantCode");
            clientCookie.remove("sessionId");
            clientCookie.remove("isLoggedin");
            window.location.reload();
          }
          return response;
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {
        promise.abort();
        dispatch(resetPagestate());
      };
    },
    [asPath, activeProfile],
  );
  return [];
}

export default function GenericLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [] = useGetPage();
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetPagestate());
    };
  }, []);
  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}
