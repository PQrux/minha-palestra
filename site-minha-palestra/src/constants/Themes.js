import { createMuiTheme } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
export default {
    default: createMuiTheme({
        palette: {
            primary: green,
            secondary: blue,
        },
        typography: {
            fontFamily: [
                'Montserrat', "sans-serif"
            ]
        }
    }),
    error: createMuiTheme({
        palette: {
            primary: green,
            secondary: {
                main: red[900],
            },
        },
        typography: {
            fontFamily: [
                'Montserrat', "sans-serif"
            ]
        }
    })
}