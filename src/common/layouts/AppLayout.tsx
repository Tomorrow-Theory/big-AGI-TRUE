import * as React from 'react';
import Head from 'next/head';
import { Box } from '@mui/joy';

import { Brand } from '~/common/app.config';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Head>
        <title>{Brand.Title.Common}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.body',
        }}
      >
        {children}
      </Box>
    </>
  );
} 