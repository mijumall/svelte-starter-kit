import type { RouterMap } from './util/query_router';
import { QueryRouter } from './util/query_router';

import Home from './lib/page/Home.svelte';
import Profile from './lib/page/Profile.svelte';
import Settings from './lib/page/Settings.svelte';
import Error from './lib/page/ErrorPage.svelte';

export const routerMap: RouterMap = {
	error: _ =>  {
		return {
			component: Error
		}
	},
	route: {
		'home': state => {
			return {
				component: Home,
				param: {
					p1: state.param.p1
				}
			}
		},
		'profile': _ => {
			return {
				component: Profile
			}
		},
		'settings': _ => {
			return {
				component: Settings
			}
		},
	},
	initialRoute: 'home'
}

export const queryRouter = new QueryRouter(routerMap);
