import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Login } from './login/Login';
// import { Logout } from './logout/Logout';
import { VisitList as Front } from './front/visitList';
import { VisitList as Main } from './main/visitList';
import { VisitorInfoForm } from './outlook/form';
import { VisitorInfoList } from './outlook/list';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        {/* <Route exact path="/logout" component={Logout} /> */}
        <Route path="/front" component={Front} />
        <Route path="/main" component={Main} />
        <Route exact path="/outlook/inputform">
          <VisitorInfoForm isRead={false} />
        </Route>
        <Route exact path="/outlook/readform">
          <VisitorInfoForm isRead={true} />
        </Route>
        <Route path="/outlook" component={VisitorInfoList} />
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}
