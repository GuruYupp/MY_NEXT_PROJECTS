import Banners from '@/components/banners/banners';
import Sections from '@/components/Sections/Sections';
import GenericLayout from './GenericLayout';

import { ReactNode } from 'react';
import TvGuide from '@/components/tvguide/Tvguide';
import Grid from '@/components/grid/Grid';
import NetworkDetails from '@/components/network-details/NetworkDetails';
import DetailsPage from '@/components/Details/Details';
import { useAppSelector } from '@/redux/hooks';
import Player from '@/components/Player/Player';
import AuthGuard from '@/components/Auth/AuthGuard';
import Search from '@/components/Search/search';

export function ContentPageWrapper(props: { children: ReactNode }) {
  const { children } = props;
  const { banners } = useAppSelector((state) => state.pageData.response);
  if (banners.length === 0)
    return <div style={{ paddingTop: '97px' }}>{children}</div>;
  return <>{children}</>;
}

function DynamicLayout(): JSX.Element {
  const { info } = useAppSelector((state) => state.pageData.response);

  function renderContentPage() {
    switch (info.path) {
      case 'catchup':
        return (
          <>
            <TvGuide />
          </>
        );
      case 'search':
        return (
            <ContentPageWrapper>
             <Search/>
            </ContentPageWrapper>
        );
      case 'tvguide':
        return <TvGuide />;
      default:
        return (
          <ContentPageWrapper>
            <Banners />
            <Sections />
          </ContentPageWrapper>
        );
    }
  }

  function renderDetailsPage() {
    if (info?.attributes?.contentType === 'network') {
      return <NetworkDetails />;
    }
    return <DetailsPage />;
  }

  return (
    <AuthGuard>
      {/* <Loading showLoading={loading}> */}
      <GenericLayout>
        <>
          {info.pageType === 'content' && renderContentPage()}
          {info.pageType == 'details' && renderDetailsPage()}
          {info.pageType == 'list' && <Grid />}
          {info.pageType == 'player' && <Player />}
        </>
      </GenericLayout>
      {/* </Loading> */}
    </AuthGuard>
  );
}

export default DynamicLayout;
