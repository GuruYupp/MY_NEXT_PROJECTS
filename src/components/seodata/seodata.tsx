import { seoInterface } from "@/shared";
import Head from "next/head";
import { useRouter } from "next/router";



function CreateMeta({property,name,content}:{property?:string,name:string,content:string}){
    if(property){
        return <meta name={name} content={content} property={property}/>
    }
    else{
        return <meta name={name} content={content}/>
    }
}

export default function SeoData({seodata}:{seodata:seoInterface}):JSX.Element{
    const {asPath} = useRouter()
    return <Head>
        {seodata.title ? <title>{seodata.title}</title> : <title>{`${asPath.split('/')[1]} MyWatcho`}</title>}
        {seodata.description && CreateMeta({name:"description",content:seodata.description})}
        {seodata.keywords && CreateMeta({name:"keywords",content:seodata.keywords}) }
    </Head>
}

