"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
globalThis.__cache_path = path_1.default.join(os_1.default.tmpdir(), "toynn-cache");
globalThis.__cache_expiry_days = 1; // expire cache in 1 day
exports.cache = {
    registry: path_1.default.join(globalThis.__cache_path, "registry.json"),
    loadRegistry: () => {
        let registry = {};
        const cachePath = globalThis.__cache_path;
        // check if cache dir exists
        if (!fs_1.default.existsSync(cachePath)) {
            fs_1.default.mkdirSync(cachePath);
            fs_1.default.writeFileSync(exports.cache.registry, "{}", "utf-8");
        }
        else {
            // check if registry exists
            if (fs_1.default.existsSync(exports.cache.registry)) {
                // load registry
                registry = JSON.parse(fs_1.default.readFileSync(exports.cache.registry, "utf-8"));
            }
            else {
                // create registry
                fs_1.default.writeFileSync(exports.cache.registry, "{}", "utf-8");
            }
        }
        return registry;
    },
    saveRegistry: (registry) => {
        // update or create registry
        exports.cache.loadRegistry(); // this will make sure that registry exists
        fs_1.default.writeFileSync(exports.cache.registry, JSON.stringify(registry), "utf-8");
    },
    entryExpired: (registry, name) => {
        if (!registry[name]) {
            return true;
        }
        const cachedAt = registry[name].cachedAt + globalThis.__cache_expiry_days * 86400000;
        const now = Date.now();
        if (cachedAt < now) {
            return true;
        }
        return false;
    },
    clean: () => {
        // garbage collection
        let registry = exports.cache.loadRegistry();
        const keys = Object.keys(registry);
        keys.forEach((e) => {
            if (exports.cache.entryExpired(registry, e)) {
                registry = exports.cache.delete(registry, e);
            }
        });
        exports.cache.saveRegistry(registry);
    },
    delete: (registry, name) => {
        const cachePath = globalThis.__cache_path;
        fs_1.default.rmSync(path_1.default.join(cachePath, registry[name].name));
        delete registry[name];
        exports.cache.saveRegistry(registry);
        return registry;
    },
    save: (name, content) => {
        // create a new entry in registry or update the entry
        let registry = exports.cache.loadRegistry();
        const cachePath = globalThis.__cache_path;
        let entry = registry[name];
        if (entry) {
            // update entry
            let loc = path_1.default.join(cachePath, entry.name);
            // check if entry is expired
            if (exports.cache.entryExpired(registry, name)) {
                registry = exports.cache.delete(registry, name);
                return undefined;
            }
            else {
                fs_1.default.writeFileSync(loc, content, "utf-8");
                registry[name].cachedAt = Date.now();
                exports.cache.saveRegistry(registry);
                return registry[name];
            }
        }
        else {
            // add new entry
            let newFileName = (0, crypto_1.randomUUID)().split("-").join("");
            newFileName += "." + name.split(".").at(-1);
            let newFilePath = path_1.default.join(cachePath, newFileName);
            fs_1.default.writeFileSync(newFilePath, content, "utf-8");
            registry[name] = {
                name: newFileName,
                cachedAt: Date.now(),
            };
            exports.cache.saveRegistry(registry);
        }
        return registry[name];
    },
    load: (name) => {
        // return filename if it exists
        let loc = undefined;
        // before loading perform garbage collection
        exports.cache.clean();
        let registry = exports.cache.loadRegistry();
        const cachePath = globalThis.__cache_path;
        // check if name exists in registry
        if (registry[name]) {
            loc = registry[name].name;
            return path_1.default.join(cachePath, loc);
        }
        return undefined;
    },
    flush: () => {
        const cachePath = globalThis.__cache_path;
        if (fs_1.default.existsSync(cachePath)) {
            fs_1.default.rmSync(cachePath, {
                recursive: true,
                force: true,
            });
        }
    },
};
exports.default = exports.cache;
