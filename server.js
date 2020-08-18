import express from 'express';
import React from 'react';
import 'isomorphic-unfetch';
import bodyParser from 'body-parser';
import webConfig from './webConfig.json';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { StaticRouter } from 'react-router-dom';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import AppComponent from './src/app';
import HTML from './src/helpers/renderer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: `${webConfig.siteURL}`,
    credentials: true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", express.static("build/public"));

app.get(['*/:param', '*'], (req, res) => {

  const URL_Param = req.params.param ? req.params.param : null;

  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: `${webConfig.siteURL}/graphql`,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const context = {
    URL_Param
  };

  // The client-side App will instead use <BrowserRouter>
  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <AppComponent />
      </StaticRouter>
    </ApolloProvider>
  );

  // Handle queries etc.. before sending raw html
  getDataFromTree(App).then(() => {

    const content = ReactDOM.renderToString(App);
    const helmet = Helmet.renderStatic();

    const initialState = client.extract();
    const html = <HTML content={content} state={initialState} helmet={helmet} />;

    res.status(200);
    res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
    res.end();

  });

});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
