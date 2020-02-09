import { createMuiTheme } from '@material-ui/core/styles';
import { green, blue } from '@material-ui/core/colors';
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
    })
}