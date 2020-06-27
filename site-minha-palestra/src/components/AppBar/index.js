import { AppBar, Link, Toolbar } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';


function Bar(props) {
  return (
    <AppBar position="static">
        <Toolbar variant="dense">
            <Link variant="h6" style={{color: "white"}} onClick={()=>{props.history.push("")}}>Minha Palestra</Link>
        </Toolbar>
    </AppBar>
  );
}
export default withRouter(Bar);
