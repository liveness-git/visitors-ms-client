import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Login } from './login/Login';
// import { Logout } from './logout/Logout';
import { VisitList } from './front/visitList';
import { VisitorInfoForm } from './outlook/form';
import { VisitorInfoList } from './outlook/list';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        {/* <Route exact path="/logout" component={Logout} /> */}
        <Route path="/front" component={VisitList} />
        <Route exact path="/outlook/form" component={VisitorInfoForm} />
        <Route path="/outlook" component={VisitorInfoList} />
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}
