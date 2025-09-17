import { IconButton, InputAdornment, TextField } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

interface PasswordFieldProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  error?: string;
  touched?: boolean;
  show: boolean;
  setShow: (value: boolean) => void;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  onEnter: () => void;
}

const PasswordField = ({
  id,
  name,
  placeholder,
  value,
  error,
  touched,
  show,
  setShow,
  disabled,
  onChange,
  onBlur,
  onEnter,
}: PasswordFieldProps) => {
  return (
    <TextField
      id={id}
      name={name}
      placeholder={placeholder}
      type={show ? 'text' : 'password'}
      value={value}
      error={touched && Boolean(error)}
      helperText={touched && error ? error : undefined}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={(e) => e.key === 'Enter' && onEnter()}
      disabled={disabled}
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
