import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { Themes } from "./constants";
import Root from "./routes/Root";
function App() {
  return (
    <ThemeProvider theme={Themes.default}>
      <Root/>
    </ThemeProvider>
  );
}

export default App;
