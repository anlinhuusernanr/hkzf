import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

import CityList from './pages/CityList/index';
import Home from './pages/Home/index';
import Map from './pages/Map/index'
import HouseDetail from './pages/HouseDetail/index'
function App() {
  return (
    <Router>
      {/* 配置路由 */}
      <Route exact path="/" render={() => <Redirect to="/home"></Redirect>}></Route>
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
      <Route path="/map" component={Map}></Route>
      <Route path="/detail/:id" component={HouseDetail}></Route>
    </Router>
  );
}

export default App;
