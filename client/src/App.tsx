/** @jsxImportSource @emotion/react */

import { Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Room from 'components/Room/Room';
import { socket } from 'utils/socket';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/room/:roomName" exact>
        <Room />
      </Route>
    </Switch>
  );
}

// execute command directly to the server
// @ts-ignore
window.bang = ({ exec, args, cb = () => {} }: any) => {
  socket.emit(exec, args, (result: any) => {
    console.log(result);
    cb(result);
  });
};

export default App;
