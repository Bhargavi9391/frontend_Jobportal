import { openDB } from "idb";

const DB_NAME = "jobPortalDB";
const STORE_NAME = "jobs";

// Initialize IndexedDB
const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        },
    });
};

// Save jobs to IndexedDB
export const saveJobsToDB = async (jobs) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.put({ id: "savedJobs", jobs });
    await tx.done;
};

// Retrieve jobs from IndexedDB
export const getJobsFromDB = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const data = await store.get("savedJobs");
    return data ? data.jobs : [];
};
