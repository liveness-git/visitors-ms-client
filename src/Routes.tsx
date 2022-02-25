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
        <Route exact path="/login" component={SignIn} />
        <Route exact path="/oauth/redirect" component={AuthorizeWrapper} />
        <Route exact path="/main/byroom" component={ByRoom} />
        <Route path="/main" component={Main} />
        {/*** 一般アドイン ***/}
        <Route exact path="/outlook/inputform">
          <VisitorInfoForm isRead={false} />
        </Route>
        <Route exact path="/outlook/readform">
          <VisitorInfoForm isRead={true} />
        </Route>
        <Route path="/outlook" component={VisitorInfoList} />
        {/*** リダイレクト ***/}
        <Redirect from="/" to="/main" />
      </Switch>
    </BrowserRouter>
  );
}
