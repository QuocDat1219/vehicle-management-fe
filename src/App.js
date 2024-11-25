import { Switch, Route } from "react-router-dom";
import Main from "./components/layout/Main";
import SignIn from "./pages/Sigin";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import PrivateRoute from "./privateRouter";
import PageNotFound from "./pages/PageNotFound";
import User from "./pages/User";
import Customer from "./pages/Customer";
import ParkingCard from "./pages/ParkingCard";
import Vehicle from "./pages/Vehicle";
import DetectionVehicle from "./pages/DetectionVehicle";
import Fee from "./pages/Fee";
import History from './pages/History';
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={SignIn} />

        <Main>
          <Switch>
            <PrivateRoute
              exact
              path="/detect"
              component={DetectionVehicle}
              allowedRoles={["user", "admin"]}
            />
            <PrivateRoute
              exact
              path="/user"
              component={User}
              allowedRoles={["admin"]}
            />
            <PrivateRoute
              exact
              path="/customer"
              component={Customer}
              allowedRoles={["admin"]}
            />
            <PrivateRoute
              exact
              path="/card"
              component={ParkingCard}
              allowedRoles={["admin"]}
            />
            <PrivateRoute
              exact
              path="/vehicle"
              component={Vehicle}
              allowedRoles={["admin"]}
            />
             <PrivateRoute
              exact
              path="/fee"
              component={Fee}
              allowedRoles={["admin"]}
            />
             <PrivateRoute
              exact
              path="/history"
              component={History}
              allowedRoles={["admin"]}
            />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
