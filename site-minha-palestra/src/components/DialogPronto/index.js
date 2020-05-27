import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { multiStorager } from '../../utils';

export default function ResponsiveDialog() {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState(undefined);
    const [body, setBody] = React.useState(undefined);
    const [buttons, setButtons] = React.useState(undefined);
    const [locked, setLocked] = React.useState(undefined);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        setOpen(false);
    };
    const showDialog = (newTitle, newBody, newButtons, isLocked) => {
        setTitle(newTitle);
        setBody(newBody);
        setButtons(newButtons);
        setLocked(isLocked ? true : false);
        setOpen(true);
        setOpen(true);
    }
    const closeDialog = () => {
        setOpen(false);
    }
    const updateDialogBody = (newBody) =>{
        setBody(newBody||body);
    }
    multiStorager.getOtherDataStorager("dialog").set("showDialog",showDialog);
    multiStorager.getOtherDataStorager("dialog").set("closeDialog",closeDialog);
    multiStorager.getOtherDataStorager("dialog").set("updateDialogBody",updateDialogBody);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={locked ? undefined : handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            {title ? <DialogTitle id="responsive-dialog-title">{title}</DialogTitle> : undefined}
            <DialogContent style={{display: "-webkit-flex"}}>
                {body}
            </DialogContent>
            <DialogActions style={{display: "-webkit-flex"}}>
                {buttons}
            </DialogActions>
        </Dialog>
    );
}