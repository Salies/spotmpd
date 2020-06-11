import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Controls from './components/Controls';
import Home from './components/Home';
import Albums from './components/Albums';
import './styles/App.css';
import Volume from './components/Controls/Volume';

//const { ipcRenderer } = window.require('electron');
/*webContents.on('update-player', (event) => {
  const choice = dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['Leave', 'Stay'],
    title: 'Do you want to leave this site?',
    message: 'Changes you made may not be saved.',
    defaultId: 0,
    cancelId: 1
  })
  const leave = (choice === 0)
  if (leave) {
    event.preventDefault()
  }
})

useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Especifique como limpar depois desse efeito:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
*/

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
