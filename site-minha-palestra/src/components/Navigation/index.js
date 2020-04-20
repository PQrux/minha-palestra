import { BottomNavigation, BottomNavigationAction, Box } from '@material-ui/core';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
class Navigation extends Component {
    constructor(props){
        super(props);
        let location = window.location.href.split("/")[3];
        this.state = {
            option: "",
        }
        if(!isNaN(location)){
            this.state.option = this.props.default.path;
        }
        else{
            this.state.option = location ? "/"+location : this.props.default.path;
        }
    }
    render() {
        return (
            <Box boxShadow="0px 1px 4px 0px black">
                <BottomNavigation
                    value={this.state.option}
                    onChange={(event, option) => {
                        this.props.history.push(option);
                        this.setState({option});
                    }}
                    showLabels
                    //variant="scrollable"
                    indicatorColor="primary"
                    //scrollButtons="on"
                    textColor="primary"
                >
                    {
                        this.props.options.map(({label, icon, path})=>(
                            <BottomNavigationAction label={label} value={path} icon={icon} key={path} />
                        ))
                    }
                </BottomNavigation>
          </Box>
        );
    }
}
export default withRouter(Navigation);