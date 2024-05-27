'use client'
import React, { createContext, useState, useContext, FC } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

type SnackbarSeverity = 'error' | 'warning' | 'info' | 'success'

interface ISnackbarContext {
  //snackbarを表示するときに呼び出す関数
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
  //Snackbarに与えるパラメータをstateで管理
  const [open, setOpen] = useState<boolean>(false)
  const [severity, setSeverity] = useState<SnackbarSeverity>('info')
  const [message, setMessage] = useState<string>('')

  //showSnackbarの実体。各stateをセットし、snackbarを表示する
  const showSnackbar = (type: SnackbarSeverity, message: string): void => {
    setOpen(true)
    setSeverity(type)
    setMessage(message)
  }

  //snackbarのxボタンが押された時のコールバック関数
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
      <SnackbarContext.Provider value={{ showSnackbar: showSnackbar }}>
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
