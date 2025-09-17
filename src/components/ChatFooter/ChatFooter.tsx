import { Button, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useTranslations } from '../../contexts/AppContext';
import Styles from '@/pages/Account/_Account.module.scss';

interface ChatFooterProps {
  loading?: boolean;
  onSave?: () => void;
}

const ChatFooter = ({ loading, onSave }: ChatFooterProps) => {
  const t = useTranslations();

  return (
    <div className={Styles.card_footer}>
      <Button
        disabled={loading}
        variant="contained"
        color="primary"
        startIcon={
          loading ? (
            <CircularProgress size="1.5rem" style={{ color: '#C0C0C0' }} />
          ) : (
            <Save />
          )
        }
        onClick={onSave}
      >
        {loading
          ? t.change_password.button.loading
          : t.change_password.button.save}
      </Button>
    </div>
  );
};

export default ChatFooter;
