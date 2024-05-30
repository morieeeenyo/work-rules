'use client'

import React, { FC, createContext, useContext, useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

type SnackbarSeverity = 'error' | 'warning' | 'info' | 'success'

interface ISnackbarContext {
  showSnackbar: ((type: SnackbarSeverity, message: string) => void) | undefined
}

const SnackbarContext = createContext<ISnackbarContext>({
  showSnackbar: undefined,
})

export function useSnackbarContext() {
  return useContext(SnackbarContext)
}

type Props = {
  children: React.ReactNode
}

export const SnackbarProvider: FC<Props> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [severity, setSeverity] = useState<SnackbarSeverity>('info')
  const [message, setMessage] = useState<string>('')

  const showSnackbar = (type: SnackbarSeverity, message: string): void => {
    setOpen(true)
    setSeverity(type)
    setMessage(message)
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}
      </SnackbarContext.Provider>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
