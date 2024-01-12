import AuthGuard from '@/components/Auth/AuthGuard';
import EditProfile from '@/components/editprofile/EditProfile';
import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';
import Settings from '@/components/settings/Settings';
import { useRouter } from 'next/router';

function MiscLayout(): JSX.Element {
  const { asPath } = useRouter();
  return (
    <AuthGuard>
      <Header />
      {asPath === '/settings' && (
        <div style={{ minHeight: '80vh' }}>
          <Settings />
        </div>
      )}
      {asPath === '/settings/edit-profile' && (
        <div style={{ minHeight: '80vh' }}>
          <EditProfile/>
        </div>
      )}
      <Footer />
    </AuthGuard>
  );
}

export default MiscLayout;
