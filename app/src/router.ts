import type { RouterMap } from './util/query_router';
import { QueryRouter } from './util/query_router';

import Home from './lib/page/Home.svelte';
import Profile from './lib/page/Profile.svelte';
import Settings from './lib/page/Settings.svelte';
import Error from './lib/page/ErrorPage.svelte';
import Crud from './lib/page/Crud.svelte';

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
		'crud': _ => {
			return {
				component: Crud
			}
		}
	},
	initialRoute: 'home'
}

export const queryRouter = new QueryRouter(routerMap);
