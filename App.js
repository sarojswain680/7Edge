/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */



import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppRouter from './Routes/index';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Reducer from './App/Reducer/index';

console.disableYellowBox = true;


const store = createStore(Reducer, applyMiddleware(thunk));


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }
}

export default App;
