import * as duckdb from '@duckdb/duckdb-wasm';
import { DuckDBBundles } from '@duckdb/duckdb-wasm';
import { getWorkerURL } from 'utils/getWorkerURL';


// import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb.wasm';
// import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm';

export async function initializeDuckDB() {
    // //@ts-ignore
    // const duckdb_wasm_next = await import('@duckdb/duckdb-wasm/dist/duckdb-eh.wasm');
    // const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    //     mvp: {
    //         mainModule: duckdb_wasm,
    //         mainWorker: new URL('/duckdb-browser.worker.js', window.location.href).toString(), // , import.meta.url
    //     },
    //     eh: {
    //         mainModule: duckdb_wasm_next,
    //         mainWorker: new URL('/duckdb-browser-eh.worker.js', window.location.href).toString(), // , import.meta.url
    //     },
    // };
    // console.log("bundle config", MANUAL_BUNDLES);
    // debugger;
    let bundles = duckdb.getJsDelivrBundles()

    function fixBundles(bundles: DuckDBBundles): DuckDBBundles {
        let b = Object.assign({}, bundles)
        b.mvp.mainWorker = getWorkerURL(b.mvp.mainWorker)
        b.eh.mainWorker = getWorkerURL(b.eh.mainWorker)
        return b
    }

    bundles = fixBundles(bundles)
    

    // Select a bundle based on browser checks
    const bundle = await duckdb.selectBundle(bundles);
    // Instantiate the asynchronus version of DuckDB-wasm
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    return db
}

export type DuckDB = duckdb.AsyncDuckDB
/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
 export class DuckDBSingleton {
    private static instance: DuckDB;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static async getInstance(): Promise<DuckDB> {
        if (!DuckDBSingleton.instance) {
            DuckDBSingleton.instance = await initializeDuckDB();
        }

        return DuckDBSingleton.instance;
    }
}
