import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { Themes } from "./constants";
import Root from "./routes/Root";
import { Modal, DialogPronto } from "./components";
function App() {
  return (
    <ThemeProvider theme={Themes.default}>
      <DialogPronto />
      <Modal />
      <Root />
    </ThemeProvider>
  );
}

export default App;
