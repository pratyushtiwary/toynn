import { randomUUID } from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

globalThis.__cache_path = path.join(os.tmpdir(), 'toynn-cache');
globalThis.__cache_expiry_days = 1; // expire cache in 1 day

export interface Registry {
    [key: string]: {
        name: string;
        cachedAt: number;
    };
}

export const cache = {
    registry: path.join(globalThis.__cache_path, 'registry.json'),
    loadRegistry: (): Registry => {
        let registry: Registry = {};
        const cachePath = globalThis.__cache_path;
        // check if cache dir exists
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath);
            fs.writeFileSync(cache.registry, '{}', 'utf-8');
        } else {
            // check if registry exists
            if (fs.existsSync(cache.registry)) {
                // load registry
                registry = JSON.parse(fs.readFileSync(cache.registry, 'utf-8'));
            } else {
                // create registry
                fs.writeFileSync(cache.registry, '{}', 'utf-8');
            }
        }
        return registry;
    },
    saveRegistry: (registry: Registry) => {
        // update or create registry
        cache.loadRegistry(); // this will make sure that registry exists

        fs.writeFileSync(cache.registry, JSON.stringify(registry), 'utf-8');
    },
    entryExpired: (registry: Registry, name: string) => {
        if (!registry[name]) {
            return true;
        }
        const cachedAt =
            registry[name].cachedAt + globalThis.__cache_expiry_days * 86400000;
        const now = Date.now();

        if (cachedAt < now) {
            return true;
        }
        return false;
    },
    clean: () => {
        // garbage collection
        let registry = cache.loadRegistry();

        const keys = Object.keys(registry);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        keys.forEach((e: any) => {
            if (cache.entryExpired(registry, e)) {
                registry = cache.delete(registry, e);
            }
        });

        cache.saveRegistry(registry);
    },
    delete: (registry: Registry, name: string) => {
        const cachePath = globalThis.__cache_path;

        fs.rmSync(path.join(cachePath, registry[name].name));

        delete registry[name];

        cache.saveRegistry(registry);

        return registry;
    },
    save: (name: string, content: string) => {
        // create a new entry in registry or update the entry
        let registry = cache.loadRegistry();
        const cachePath = globalThis.__cache_path;
        const entry = registry[name];

        if (entry) {
            // update entry
            const loc = path.join(cachePath, entry.name);

            // check if entry is expired
            if (cache.entryExpired(registry, name)) {
                registry = cache.delete(registry, name);
                return undefined;
            } else {
                fs.writeFileSync(loc, content, 'utf-8');
                registry[name].cachedAt = Date.now();
                cache.saveRegistry(registry);
                return registry[name];
            }
        } else {
            // add new entry
            let newFileName = randomUUID().split('-').join('');
            newFileName += '.' + name.split('.').at(-1);
            const newFilePath = path.join(cachePath, newFileName);

            fs.writeFileSync(newFilePath, content, 'utf-8');

            registry[name] = {
                name: newFileName,
                cachedAt: Date.now(),
            };

            cache.saveRegistry(registry);
        }

        return registry[name];
    },
    load: (name: string): string => {
        // return filename if it exists
        let loc = undefined;
        // before loading perform garbage collection
        cache.clean();
        const registry = cache.loadRegistry();
        const cachePath = globalThis.__cache_path;

        // check if name exists in registry
        if (registry[name]) {
            loc = registry[name].name;
            return path.join(cachePath, loc);
        }
        return undefined;
    },
    flush: () => {
        const cachePath = globalThis.__cache_path;
        if (fs.existsSync(cachePath)) {
            fs.rmSync(cachePath, {
                recursive: true,
                force: true,
            });
        }
    },
};

export default cache;
