import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { SignIn } from './login/Main';
import { AuthorizeWrapper } from 'login/Main/Authorize';
import { VisitList } from './main/visitList';
import { ByRoom } from './main/byRoom';
import { Front } from './main/front';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:location?/login" component={SignIn} />
        <Route exact path="/oauth/redirect" component={AuthorizeWrapper} />
        <Route exact path="/:location/main" component={VisitList} />
        <Route exact path="/:location/main/byroom" component={ByRoom} />
        <Route exact path="/:location/front" component={Front} />
        {/*** リダイレクト ***/}
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}
