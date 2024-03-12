import { useRouter } from "next/router";
import React from "react";

const SsoLayout = () => {
  const { query, replace } = useRouter();

  if (query.ut) {
    let ut = query.ut as string;
    let decodedParamsstring = decodeURI(atob(ut));
    let decodedParams = JSON.parse(
      '{"' +
        decodedParamsstring
          .replace(/"/g, '\\"')
          .replace(/&&&/g, '","')
          .replace(/===/g, '":"') +
        '"}',
    );
    if (decodedParams.redirect) {
      replace(decodedParams.redirect);
    }
  }

  return (
    <>
      <div style={{ minHeight: "80vh" }}>
        <h1>Hello world..</h1>
      </div>
    </>
  );
};

export default SsoLayout;
