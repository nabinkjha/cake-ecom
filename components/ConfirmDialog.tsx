import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export interface SimpleDialogProps {
  open: boolean;
  selectedId:number;
  dialogTitle:string;
  okButtonText: string;
  cancelButtonText: string;
  dialogContentText:string;
  onClose: (value: string, selectedId:number) => void;
}

export default function ConfirmDialog(props: SimpleDialogProps) {
  const { onClose, selectedId, open,dialogTitle, okButtonText,cancelButtonText,dialogContentText} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose  = (value: string) => {
    onClose(value,selectedId);
  };


  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          {dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose("Cancel")}>
            {cancelButtonText}
          </Button>
          <Button onClick={() => handleClose("Ok")} autoFocus>
            {okButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}