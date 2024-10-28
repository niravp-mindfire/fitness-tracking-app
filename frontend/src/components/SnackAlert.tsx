import { Alert, Snackbar } from '@mui/material';

const SnackAlert = ({ snackbarOpen, setSnackbarOpen, type, message }: any) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={5000}
      onClose={() => setSnackbarOpen(false)}
    >
      <Alert onClose={() => setSnackbarOpen(false)} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackAlert;
