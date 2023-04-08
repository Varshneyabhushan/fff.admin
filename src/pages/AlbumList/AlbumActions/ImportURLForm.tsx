import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface FormDialogProps {
    open : boolean;
    setOpen : (status : boolean) => void;
    onSubmit : (url : string) => void;
}

export default function ImportURLFormDialog({ onSubmit, open, setOpen } : FormDialogProps) {
    const [text, setText] = React.useState("")

    function onDone() {
        onSubmit(text)
        setOpen(false)
        setText("")
    }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Import album from URL</DialogTitle>
        <DialogContent>
          <DialogContentText>
            enter the url to import the album from 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="album url"
            fullWidth
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onDone}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
