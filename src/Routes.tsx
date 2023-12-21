import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

// import { SignIn } from 'login';
// import { AuthorizeWrapper } from 'login/Authorize';
import { SignIn } from 'loginV2';
import { AuthorizeWrapper } from 'loginV2/Authorize';
import { VisitList } from 'main/visitList';
import { ByRoom } from 'main/byRoom';
import { Front } from 'main/front';
import { RoleSettings } from 'master/role';
import { LocationSettings } from 'master/location';
import { CategorySettings } from 'master/category';
import { RoomSettings } from 'master/room';
import { ResetCache } from 'master/ResetCache';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:location?/login" component={SignIn} />
        {/* <Route exact path="/oauth/redirect" component={AuthorizeWrapper} /> */}
        <Route exact path="/redirect" component={AuthorizeWrapper} />
        <Route exact path="/:location/main" component={VisitList} />
        <Route exact path="/:location/main/byroom" component={ByRoom} />
        <Route exact path="/:location/front" component={Front} />
        <Route exact path="/:location?/settings/role" component={RoleSettings} />
        <Route exact path="/:location?/settings/location" component={LocationSettings} />
        <Route exact path="/:location?/settings/category" component={CategorySettings} />
        <Route exact path="/:location?/settings/room" component={RoomSettings} />
        <Route exact path="/:location?/settings/resetcache" component={ResetCache} />
        {/*** リダイレクト ***/}
        <Redirect from="/:location?/" to="/:location?/login" />
      </Switch>
    </BrowserRouter>
  );
}
