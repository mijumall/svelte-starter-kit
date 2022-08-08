const DBNAME = 'moonlight';
const VERSION = 1;

export class Box {
	private box: IDBObjectStore | undefined;

	private constructor() {}

	private static connect(objectStore: string): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const openRequest = indexedDB.open(DBNAME, VERSION);

			openRequest.onsuccess = (e: Event) => {
				const idb = (e.target as IDBOpenDBRequest).result;
				resolve(idb);
			};

			openRequest.onerror = _ => reject();

			openRequest.onupgradeneeded = (e: Event) => {
				const idb = (e.target as IDBOpenDBRequest).result;
				idb.createObjectStore(objectStore, {keyPath: 'key'});
			};
		});
	}

	static async init(objectStore: string): Promise<Box> {
		const box = new Box();
		
		const idb = await this.connect(objectStore);
		box.box = idb.transaction([objectStore], 'readwrite').objectStore(objectStore);

		return box;
	}

	private getKeys(): Promise<IDBValidKey[]> {
		return new Promise((resolve, _) => {
			const keysRequest = this.box!.getAllKeys();

			keysRequest.onsuccess = _ => resolve(keysRequest.result);
			keysRequest.onerror = _ => resolve([]);
		})
	}

	// CRUD
	async get(key: string): Promise<any> {
		const keys = await this.getKeys()
		return new Promise((resolve, reject) => {
			if (!keys.includes(key)) {
				resolve(null);
				return;
			}

			const getRequest = this.box!.get(key)

			getRequest.onsuccess = _ => {
				const obj: any = getRequest.result['obj'];
				resolve(obj);
			}; 
			getRequest.onerror = _ => reject("Error at box.get");
		});
	}

	put(key: string, obj: any): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const putRequest = this.box!.put({key: key, obj: obj});

			putRequest.onsuccess = _ => resolve(true);
			putRequest.onerror = _ => reject();
		});
	}
	
	delete(key: string): Promise<boolean> {
		return new Promise((resolve, _) => {
			const deleteRequest = this.box!.delete(key);

			deleteRequest.onsuccess = _ => resolve(true);
			deleteRequest.onerror = _ => resolve(false);
		})
	}
}

