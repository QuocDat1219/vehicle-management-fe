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

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={SignIn} />

        <Main>
          <Switch>
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
            <Route path="*" component={PageNotFound} />
          </Switch>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
