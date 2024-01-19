import Seodata from "@/components/seodata/seodata";
import { seoInterface } from "@/shared";
import { GetServerSideProps } from "next";
import ErrorBoundary from "@/Errorboundary";
import GenericLayout from "@/layouts/GenericLayout";
import Searchv3 from "@/components/Searchv3/search";
import Searchv1 from "@/components/Searchv1/search";
import { ContentPageWrapper } from "@/layouts/DynamicLayout";
import appConfig from "@/app.config";
// import Layout from "@/layouts/Layout";


export default function SearchPage({ seodata }: { seodata: seoInterface }) {
  return (
    <>
      {
        <Seodata seodata={seodata} />
      }
      <ErrorBoundary fallback={<p>Something went Wrong ❌❌</p>}>
        <GenericLayout>
          <ContentPageWrapper>
            {appConfig.search.apiversion === "v3" ? <Searchv3/> : <Searchv1/>}
          </ContentPageWrapper>
        </GenericLayout>
      </ErrorBoundary>
    </>
  );
}



export const getServerSideProps: GetServerSideProps = async () => {
  //args context:GetServerSidePropsContext
  // let cookies = parse(context.req.headers["cookie"] || "")
  // console.log("cookies: ",cookies)
  // if (!(cookies && (cookies.boxId || cookies.sessionId || cookies.tenantCode))) {
  //   // const auth_headers = await initAPIS(context)
  //   // await createSession({context,...auth_headers})
  //   // cookies = auth_headers;
  //   return {
  //     props:{
  //       seodat:{}
  //     }
  //   }
  // }

  // const url = await getBaseApi();
  // let arr = context.resolvedUrl.split('/')
  // arr.shift()
  // let seo_url = arr.join('/') == "/" ? "home" :arr.join('/')
  // let seodata =  await fetchdata(`${url}/service/api/v1/page/seo?path=${seo_url}`,{
  //   'session-id':cookies.sessionId,
  //   'box-id':cookies.boxId,
  //   'tenant-code':cookies.tenantCode
  // });

  // console.log("seodata: ",seodata)

  // if(seodata.status == false && seodata.error.code == 404){
  //   return {
  //       notFound:true
  //   }
  // }

  // if (seodata.status == false && seodata.error.code == 401) {
  // console.log(seodata)
  // const auth_headers = await initAPIS(context)
  // await createSession({context,...auth_headers})
  // cookies = auth_headers;
  // //service/api/v1/page/content?path=videos&count=40
  // seodata =  await fetchdata(`${url}/service/api/v1/page/seo?path=${seo_url}`,{
  //     'session-id':cookies.sessionId,
  //     'box-id':cookies.boxId,
  //     'tenant-code':cookies.tenantCode
  // });
  //   return {
  //     props: {
  //       seodata: seodata.status ? seodata.response : {},
  //     },
  //   };
  // }

  // console.log(seodata)
  let seodata = {
    status: false,
    response: {}
  }
  return {
    props: {
      seodata: seodata.status ? seodata.response : {}
    }
  }
}