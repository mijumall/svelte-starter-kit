import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const scrollBinder = writable<Element>(document.createElement('main'));

export interface Component {
	component: object,
	param?: {
		[param: string]: any
	}
}

export interface RouterMap {
	error: (state: QueryParam) => Component,
	route: {
		[page: string]: (state: QueryParam) => Component
	},
	initialRoute: string
}

interface QueryParam {
	page: string,
	param: {
		[key: string]: string
	},
	scrollPosition?: {
		top: number,
		left: number,
	}
}

export class QueryRouter {
	readonly routerMap: RouterMap;
	readonly app: Writable<Component>;
	readonly routePageKey = new Set<string>();
	readonly pagestateHistory: QueryParam[];
	readonly initialBrowserHistoryLength: number;

	constructor(routerMap: RouterMap) {
		this.pagestateHistory = [];
		this.routerMap = routerMap;
		this.initialBrowserHistoryLength = history.length;

		for (const pageKey in routerMap.route) {
			this.routePageKey.add(pageKey)
		}

		this.app = writable<Component>();

		// initial page
		const queryParams = new URL(location.href).searchParams;
		const page = queryParams.get('page');

		if (page === null) {
			this.push({
				page: routerMap.initialRoute,
				param: {},
				scrollPosition: { top: 0, left: 0 }
			});

			// This block is executed when entered-url is
			// http(s)://{host}/, no parameters. 
			// So, after this.push and it adding pagestateHistory,
			// the history need be emptied.
			this.pagestateHistory = [];
		} else {
			this.app = writable<Component>(this.render(page));
		}

		window.onpopstate = () => {
			this.pop()
		}
	}

	render(page: string): Component {
		const queryParams = new URL(location.href).searchParams;
		let state: QueryParam = {page: page, param: {}};
		for (const key of queryParams.keys()) {
			state.param[key] = queryParams.get(key) as string;
		}

		// Check if router has corresponding 'page' key
		const pageNotExist = !this.routePageKey.has(page);

		// Render error page
		if (pageNotExist) {
			return {
				component: this.routerMap.error(state).component,
				param: {...state}
			}
		}

		return {
			component: this.routerMap.route[page](state).component,
			param: {...state}
		}
	}

	push(queryParam: QueryParam, isPop: boolean = false) {
		// For scroll operation
		let mainElement: Element = document.createElement('main');
		scrollBinder.subscribe(e => mainElement = e);

		// Save current state to history if it's not pop, 
		// in other words, normal push
		if (!isPop) {
			const queryParams = new URL(location.href).searchParams;
			let currentPageState: QueryParam = {
				page: '',
				param: {},
				scrollPosition: {
					left: 0,
					top: 0
				}
			};

			// Save current page state to popstateHistory
			for (const key of queryParams.keys()) {
				currentPageState.param[key] = queryParams.get(key) as string;
			}

			currentPageState.page = currentPageState.param.page;

			currentPageState.scrollPosition!.left = mainElement.scrollLeft;
			currentPageState.scrollPosition!.top = mainElement.scrollTop;

			this.pagestateHistory.push(currentPageState);
		}

		// Analyze new page's query
		let query = `?page=${queryParam.page}`;

		for (const key in queryParam.param) {
			if (key === 'page') {
				continue;
			}
			query += `${key}=${queryParam.param[key]}&`
		}

		// Remove last '&'
		if (query[length-1] === '&') {
			query = query.slice(0, length-1);
		}

		history.pushState(null, '', query);
		this.app.set(this.render(queryParam.page))

		// Scroll to a certain position. Default is top.
		let left = 0;
		let top = 0;

		if (queryParam.scrollPosition !== undefined) {
			left = queryParam.scrollPosition.left;
			top = queryParam.scrollPosition.top;
		}

		setTimeout(
			() => {
				mainElement.scroll({
					left: left,
					top: top,
					behavior: 'auto'
				}),
				0
			}
		)

		// Remove duplicated pagestateHistory
		if (this.isPageStateHistoryDuplicate()) {
			this.pagestateHistory.pop();
		}
	}

	private isPageStateHistoryDuplicate(): boolean {
		const len = this.pagestateHistory.length;
		if (len <= 1) {
			return false;
		}

		const h1 = this.pagestateHistory[len - 1];
		const h2 = this.pagestateHistory[len - 2];

		// Check page
		if (h1.page != h2.page) {
			return false;
		}

		// Check param 
		for (const key1 in h1.param) {
			for (const key2 in h2.param) {
				if (
					key1 !== key2 || 
					h1.param[key1] !== h2.param[key2]
				) {
					return false;
				}
			}
		}

		// Check scroll position
		if (
			h1.scrollPosition!.left !== h2.scrollPosition!.left ||
			h1.scrollPosition!.top !== h2.scrollPosition!.top
		) {
			return false;
		}

		return true;
	}

	pop(): boolean {
		if (this.pagestateHistory.length === 0) {
			// Quit this app
			const howManyToBack = Math.max(history.length - this.initialBrowserHistoryLength - 1, 1);
			history.go(-howManyToBack);
			return false;
		}
		const previousState = this.pagestateHistory.pop() as QueryParam;

		this.push(
			{
				page: previousState.page, 
				param: previousState.param,
				scrollPosition: {
					top: previousState.scrollPosition!.top,
					left: previousState.scrollPosition!.left,
				}
			},
			true,
		)

		return true;
	}
}
