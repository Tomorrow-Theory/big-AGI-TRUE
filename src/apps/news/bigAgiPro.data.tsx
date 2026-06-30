import * as React from 'react';

import { Button, Card, CardContent, Grid, Typography } from '@mui/joy';
import RocketLaunchRounded from '@mui/icons-material/RocketLaunchRounded';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import { Link } from '~/common/components/Link';
import { clientUtmSource } from '~/common/util/pwaUtils';


export const bigAgiProUrl = 'https://big-agi.com' + clientUtmSource('upgrade');

export function BigAgiProNewsCallout() {

  const bigAgiSupportUrl = 'https://form.typeform.com/to/nLf8gFmx?utm_source=big-agi-1&utm_medium=app&utm_campaign=support';

  return (
    <Card variant='solid' color='primary' invertedColors>
      <CardContent sx={{ gap: 2 }}>
      </CardContent>
    </Card>
  );
}