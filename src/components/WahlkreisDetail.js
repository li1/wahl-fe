import React from "react";

import Dialog, { DialogTitle,
                 DialogContent,
                 DialogContentText } from 'material-ui/Dialog';


const WahlkreisDetail = props => {
  const {close, ...other} = props;

  return (
    <Dialog onRequestClose={ close }
            {...other}>
      <DialogTitle>Wahlkreisdetails</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Let Google help apps determine location. This means sending anonymous location data to
          Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default WahlkreisDetail;
