import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Controls from './components/Controls';
import Home from './components/Home';
import Albums from './components/Albums';
import './styles/App.css';
import Volume from './components/Controls/Volume';

function App({initialData}){
  console.log('app renderizando')
  return (
    <Router>
      <div className="App">
        <div className="menubar">
          <Link to="/">Home</Link> - <Link to="/albums">Albums</Link>
        </div>
        <div className="wrapper">
          <Switch>
            <Route path="/albums">
              <Albums/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
        </div>
        <div className="controls unselectable">
          <Controls initial={initialData}/>
          <Volume />
        </div>
      </div>
    </Router>
  );
}

export default App;
