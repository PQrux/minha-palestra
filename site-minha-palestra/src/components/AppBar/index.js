import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link, AppBar, Slide, Toolbar, useScrollTrigger } from '@material-ui/core';


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
