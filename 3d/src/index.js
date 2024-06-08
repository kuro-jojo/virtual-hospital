import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'

import { createStore } from 'redux';
import rootReducer from './store/Store';
import App from './App';

const rootElement = document.getElementById('root');

const store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}>
  <App />
</Provider>,
  rootElement);

// serviceWorker.unregister();
