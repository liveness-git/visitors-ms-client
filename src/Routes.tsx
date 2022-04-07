import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { Login } from './login/Front';
import { SignIn } from './login/Main';
import { AuthorizeWrapper } from 'login/Main/Authorize';

import { VisitList as Front } from './front/visitList';

import { VisitList as Main } from './main/visitList';
import { ByRoom } from './main/byRoom';

import { VisitorInfoForm } from './outlook/form';
import { VisitorInfoList } from './outlook/list';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        {/*** フロント ***/}
        <Route exact path="/front/login" component={Login} />
        {/* <Route exact path="/logout" component={Logout} /> */}
        <Route path="/front" component={Front} />
        {/*** 一般メイン ***/}
        <Route exact path="/:location?/login" component={SignIn} />
        <Route exact path="/oauth/redirect" component={AuthorizeWrapper} />
        <Route exact path="/:location/main/byroom" component={ByRoom} />
        <Route exact path="/:location/main" component={Main} />
        {/*** リダイレクト ***/}
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}
