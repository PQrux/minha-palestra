import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';

export default function Administracao(props){
    const options = props.options || [];
    return (
        <Box display="flex" flexDirection="column" padding="20px">
            {options.map(o=>(
                <Button style={styles.button} variant="outlined" key={o.path} color="primary" onClick={()=>{props.history.push(o.path)}}>
                    {o.icon} {o.label}
                </Button>
            ))}
        </Box>
    )
}
const styles = {
    button: {
        marginBottom: 10,
    }
}