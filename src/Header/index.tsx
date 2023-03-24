
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, useTheme } from "@mui/material"
import QueueService from '../services/Queue';
import config from '../config';
import { Suspense, useState } from 'react';
import Resource from '../utils/resource/Resource';
import toResource from '../utils/resource/toResource';
import ErrorBoundary from '../utils/resource/ErrorBoundary';

const queueService = new QueueService(config.queueAPIUrl)
const status = toResource(queueService.getTotalItems())

export default function Header() {


  const [resource, setResource] = useState<Resource<number>>(status)

  function refreshStatus() {
    setResource(toResource(queueService.getTotalItems()))
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Models
          </Typography>
          <ErrorBoundary fallback={"status loading failed"}>
            <QueueStatus resource={resource} />
          </ErrorBoundary>
          <Button variant='contained' onClick={() => refreshStatus()}> status </Button>
        </Toolbar>
      </AppBar>

    </Box>
  );
}

interface QueueStatusProps {
  resource: Resource<number> | undefined;
}

function QueueStatus({ resource }: QueueStatusProps) {

  const theme = useTheme()

  return (

    <Suspense fallback={"loading..."}>
      <Typography variant='h6' sx={{ marginRight: theme.spacing(2) }}>
        {resource?.read() || "not ready"}
      </Typography>
    </Suspense>
  )
}