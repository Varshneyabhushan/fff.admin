
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
import useHeaderState from './state';
import { Outlet } from 'react-router-dom';

const queueService = new QueueService(config.queueAPIUrl)
const status = toResource(queueService.getTotalItems())

export default function Header() {


  const [resource, setResource] = useState<Resource<number>>(status)
  function refreshStatus() {
    setTimeout(() => {
      setResource(toResource(queueService.getTotalItems()))
    },
    0)
  }

  const state = useHeaderState()

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {state.title}
          </Typography>
          <ErrorBoundary fallback={"status loading failed"}>
            <QueueStatus resource={resource} />
          </ErrorBoundary>
          <Button variant='contained' onClick={refreshStatus}> status </Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Outlet />
    </>
  );
}

interface QueueStatusProps {
  resource: Resource<number>;
}

function QueueStatus({ resource }: QueueStatusProps) {

  const theme = useTheme()
  const result = resource.read()

  return (
    <Suspense fallback={"loading..."}>
      <Typography variant='h6' sx={{ marginRight: theme.spacing(2) }}>
        {result}
      </Typography>
    </Suspense>
  )
}