// client/src/components/common/ConfirmationDialog.jsx
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onConfirm} autoFocus color="error">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;