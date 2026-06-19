import { Helmet, HelmetProvider } from 'react-helmet-async';

import { PageContainerProps } from '@/type/common.types';


const PageContainer = ({ title, description, children }: PageContainerProps) => (
  <HelmetProvider>
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  </HelmetProvider>
);

export default PageContainer;
