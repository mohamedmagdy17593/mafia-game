/** @jsxImportSource @emotion/react */

import { Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Room from 'components/Room/Room';

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

export default App;
