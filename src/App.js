import React from 'react';
import { ApolloProvider } from "@apollo/client";
import { client } from "./client/ApolloClient";
import { Provider } from 'react-redux';
import './App.css';
import PublicRoutes from './store/router';
import { store, history } from './store/store';



function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PublicRoutes history={history} />
      </Provider>
    </ApolloProvider>
  );
}

export default App;
