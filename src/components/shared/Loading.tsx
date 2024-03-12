import React, { ReactNode } from "react";
import appConfig from "@/app.config";

interface propsInterfaceLoading {
  showLoading: boolean;
  children: ReactNode;
}

function getLoader() {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        height: "calc(100vh - 80px)",
      }}
    >
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div className="Loader">
          <img
            src={`${appConfig.staticImagesPath}loader-icon.png`}
            alt="loader"
            height="75px"
            width="75px"
          />
        </div>
      </div>
    </div>
  );
}

function Loading(props: propsInterfaceLoading) {
  const { showLoading } = props;
  return showLoading ? getLoader() : <>{props.children}</>;
}

export default Loading;
