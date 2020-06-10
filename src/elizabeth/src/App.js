import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Controls from './components/Controls';
import Home from './components/Home';
import Albums from './components/Albums';
import './styles/App.css';

function App(){
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
        <Controls></Controls>
      </div>
    </Router>
  );
}

export default App;
