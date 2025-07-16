import { createTheme } from '@mui/material'

const theme = createTheme({
   typography: {
      fontFamily: 'Inter'
   },
   components: {
      MuiFormHelperText: {
         styleOverrides: {
            root: {
               marginLeft: 0
            }
         }
      },
      MuiButton: {
         variants: [
            {
               props: {  size: 'medium' },
               style: {
                  height: '48px',
                  fontSize: '1rem'
               }
            }
         ],
         styleOverrides: {
            root: {
               borderRadius: '12px',
               textTransform: 'none',
               whiteSpace: 'nowrap',
               minWidth: 'auto !important'
            }
         }
      },
      MuiInputLabel: {
         styleOverrides: {
            asterisk: {
               color: 'red'
            }
         }
      },
      MuiFormControl: {
         styleOverrides: {
            root: {
               width: '100% !important',
               marginBottom: '1rem',
               '&.MuiTextField-root': {
                  width: 'auto'
               }
            }
         }
      },
      MuiFormControlLabel: {
         styleOverrides: {
            asterisk: {
               color: 'red'
            }
         }
      },
      MuiDialogTitle: {
         styleOverrides: {
            root: {
               boxShadow: '0px 3px 11px 0px rgba(86, 86, 86, 0.31)',
               webkitBoxShadow: '0px 3px 11px 0px rgba(86, 86, 86, 0.31)',
               mozBoxShadow: '0px 3px 11px 0px rgba(86, 86, 86, 0.31)',
               justifyContent: 'space-between',
               alignItems: 'center',
               display: 'flex'
            }
         }
      },
      MuiInputBase: {
         variants: [
            {
               props: { size: 'small' },
               style: {
                  height: '46px',
                  marginTop: '.25rem'
               }
            },
            {
               props: { multiline: true },
               style: {
                  height: 'auto !important',
                  marginTop: '.25rem'
               }
            }
         ],
         defaultProps: {
            size: 'small'
         },
         styleOverrides: {
            root: {
               borderRadius: '12px !important'
            }
         }
      },
      MuiFormLabel: {
         styleOverrides: {
            root: {
               whiteSpace: 'normal !important'
            }
         }
      }
   }
})

export default theme