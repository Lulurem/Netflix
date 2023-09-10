import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={["/search", "?keyword=:keyword"]}>
          <Search />
        </Route>
        <Route path={["/tv", "/tvshows/:tvId"]}>
          <Tv />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
