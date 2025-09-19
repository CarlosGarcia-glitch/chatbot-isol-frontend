import { IconButton, InputAdornment, TextField } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

interface PasswordFieldProps {
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  error?: string;
  touched?: boolean;
  show: boolean;
  setShow: (value: boolean) => void;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  onEnter: () => void;
  variant?: 'outlined' | 'filled' | 'standard';
  label?: string;
}

const PasswordField = ({
  error,
  touched,
  show,
  setShow,
  onEnter,
  ...props
}: PasswordFieldProps) => {
  return (
    <TextField
      {...props}
      type={show ? 'text' : 'password'}
      error={touched && Boolean(error)}
      helperText={touched && error ? error : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onEnter()}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow(!show)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {show ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
