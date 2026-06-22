'use client'

import { useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

import PageContainer from '@/components/container/PageContainer';
import ProfitExpenses from '@/components/dashboard/ProfitExpenses';
import TopPayingClients from '@/components/dashboard/TopPayingClients';
import { getCookieUser } from '@/utils/cookie.util';


const Dashboard = () => {
  const user = getCookieUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (user && user.roll !== 6 && user && user.roll !== 5) {
    return <></>
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <ProfitExpenses />
          </Grid>
          <Grid item xs={12} lg={12}>
            <TopPayingClients />
          </Grid>
          <Grid item xs={12}>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;

