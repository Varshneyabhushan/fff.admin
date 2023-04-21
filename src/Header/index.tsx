
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IconButton, useTheme } from "@mui/material"
import QueueService from '../services/Queue';
import config from '../config';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Refresh } from '@mui/icons-material';

const queueService = new QueueService(config.queueAPIUrl)

export default function Header() {

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "end" }}>
            <QueueStatus />
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}

//in seconds
const refreshTime = 5000

function QueueStatus() {

  const theme = useTheme()
  const [totalItems, setTotalItems] = useState(0)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(true)

  const refreshStatus = useCallback(() => {
    queueService.getTotalItems()
      .then(result => setTotalItems(result))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  },
  [setTotalItems, setError, setLoading]
  )


  useEffect(() => {
    refreshStatus()
    let timeout = setInterval(() => {
      refreshStatus()
    }, refreshTime);

    return () => clearInterval(timeout)
  },
    [refreshStatus])


  return (
    <div style={{ display: "flex" }}>
      {
        loading ? "loading" :
          (
            <>
              {
                (error && error.length !== 0) ? error :
                  (
                    <>
                      <Typography variant='h6' sx={{ marginRight: theme.spacing(2) }}>
                        {totalItems}
                      </Typography>
                      <IconButton onClick={refreshStatus} color='inherit'>
                        <Refresh />
                      </IconButton>
                    </>
                  )
              }
            </>
          )

      }

    </div>


  )
}