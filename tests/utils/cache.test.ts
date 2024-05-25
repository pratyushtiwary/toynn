import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

const mockRegistry = {
  "test.csv": {
    name: "test.csv",
    cachedAt: Date.now() + 1000,
  },
  "expired.csv": {
    name: "test.csv",
    cachedAt: 0,
  },
};

jest.mock("fs");

import cache from "../../utils/cache";

const cachePath = path.join(os.tmpdir(), "toynn-cache"),
  registryPath = path.join(cachePath, "registry.json");

describe("Cache tests", () => {
  test("Cache & Registry Path", () => {
    expect(globalThis.__cache_path).toBe(cachePath);
    expect(cache.registry).toBe(registryPath);
  });

  test("loadRegistry", () => {
    fs.existsSync = jest.fn(() => true) as jest.Mock;
    fs.readFileSync = jest.fn(() => JSON.stringify(mockRegistry)) as jest.Mock;

    expect(cache.loadRegistry()).toStrictEqual(mockRegistry);

    fs.existsSync = jest.fn(() => false) as jest.Mock;
    fs.mkdirSync = jest.fn((path) => expect(path).toBe(cachePath)) as jest.Mock;
    fs.writeFileSync = jest.fn((path, value, encoding) => {
      expect(path).toBe(registryPath);
      expect(value).toBe("{}");
      expect(encoding).toBe("utf-8");
    }) as jest.Mock;

    expect(cache.loadRegistry()).toStrictEqual({});

    fs.existsSync = jest.fn((path) => {
      if (path === cachePath) {
        return true;
      }
      return false;
    }) as jest.Mock;
    fs.writeFileSync = jest.fn((path, value, encoding) => {
      expect(path).toBe(registryPath);
      expect(value).toBe("{}");
      expect(encoding).toBe("utf-8");
    }) as jest.Mock;

    expect(cache.loadRegistry()).toStrictEqual({});
  });

  test("saveRegistry", () => {
    fs.writeFileSync = jest.fn((path, content, encoding) => {
      expect(path).toBe(registryPath);
      expect(content).toBe(JSON.stringify(mockRegistry));
      expect(encoding).toBe("utf-8");
    }) as jest.Mock;

    const realLoadRegistry = cache.loadRegistry;

    cache.loadRegistry = jest.fn() as jest.Mock;

    cache.saveRegistry({ ...mockRegistry });

    cache.loadRegistry = realLoadRegistry;
  });

  test("entryExpired", () => {
    expect(cache.entryExpired(mockRegistry, "test.csv")).toBe(false);
    expect(cache.entryExpired(mockRegistry, "expired.csv")).toBe(true);
  });

  test("clean", () => {
    const realLoadRegistry = cache.loadRegistry;
    const realSaveRegistry = cache.saveRegistry;

    cache.loadRegistry = jest.fn(() => ({ ...mockRegistry })) as jest.Mock;
    cache.saveRegistry = jest.fn() as jest.Mock;

    cache.clean();

    expect(cache.loadRegistry).toHaveBeenCalled();
    expect(cache.saveRegistry).toHaveBeenCalledWith({
      "test.csv": { ...mockRegistry["test.csv"] },
    });

    cache.loadRegistry = realLoadRegistry;
    cache.saveRegistry = realSaveRegistry;
  });

  test("delete", () => {
    const realSaveRegistry = cache.saveRegistry;
    cache.saveRegistry = jest.fn() as jest.Mock;
    fs.rmSync = jest.fn((p) => {
      expect(p).toBe(path.join(cachePath, mockRegistry["test.csv"].name));
    }) as jest.Mock;

    const newRegistry = {
      "expired.csv": {
        name: "test.csv",
        cachedAt: 0,
      },
    };

    expect(cache.delete({ ...mockRegistry }, "test.csv")).toStrictEqual(
      newRegistry,
    );

    expect(cache.saveRegistry).toHaveBeenCalledWith(newRegistry);

    cache.saveRegistry = realSaveRegistry;
  });

  test("save", () => {
    const realLoadRegistry = cache.loadRegistry;
    const realSaveRegistry = cache.saveRegistry;
    const realDelete = cache.delete;

    crypto.randomUUID = jest.fn(() => "test2") as jest.Mock;
    cache.loadRegistry = jest.fn(() => ({ ...mockRegistry })) as jest.Mock;
    cache.saveRegistry = jest.fn() as jest.Mock;
    cache.delete = jest.fn(() => ({ ...mockRegistry }));
    fs.writeFileSync = jest.fn((loc, content, encoding) => {
      expect(loc).toBe(path.join(cachePath, "test.csv"));
      expect(content).toBe("hello world");
      expect(encoding).toBe("utf-8");
    }) as jest.Mock;
    Date.now = jest.fn(() => mockRegistry["test.csv"].cachedAt) as jest.Mock;

    // entry exists and is not expired
    expect(cache.save("test.csv", "hello world")).toStrictEqual(
      mockRegistry["test.csv"],
    );
    expect(cache.saveRegistry).toHaveBeenCalled();

    // entry exists but is expired
    expect(cache.save("expired.csv", "hello world")).toBe(undefined);
    expect(cache.delete).toHaveBeenCalled();
    fs.writeFileSync = jest.fn((loc, content, encoding) => {
      expect(loc).toBe(path.join(cachePath, "test2.csv"));
      expect(content).toBe("hello world!");
      expect(encoding).toBe("utf-8");
    }) as jest.Mock;

    // entry does not exists
    expect(cache.save("test2.csv", "hello world!")).toStrictEqual({
      name: "test2.csv",
      cachedAt: mockRegistry["test.csv"].cachedAt,
    });
    expect(cache.saveRegistry).toHaveBeenCalled();
    expect(crypto.randomUUID).toHaveBeenCalled();

    cache.loadRegistry = realLoadRegistry;
    cache.saveRegistry = realSaveRegistry;
    cache.delete = realDelete;
  });

  test("load", () => {
    const realClean = cache.clean;
    const realLoadRegistry = cache.loadRegistry;

    cache.clean = jest.fn();
    cache.loadRegistry = jest.fn(() => ({ ...mockRegistry })) as jest.Mock;

    // entry exists
    expect(cache.load("test.csv")).toBe(path.join(cachePath, "test.csv"));

    // entry doesn't exists
    expect(cache.load("xyz.csv")).toBe(undefined);

    cache.clean = realClean;
    cache.loadRegistry = realLoadRegistry;
  });

  test("flush", () => {
    fs.existsSync = jest.fn(() => true);

    fs.rmSync = jest.fn();

    cache.flush();

    expect(fs.rmSync).toHaveBeenCalledWith(cachePath, {
      recursive: true,
      force: true,
    });

    fs.existsSync = jest.fn(() => false);
    fs.rmSync = jest.fn(); // resets the call count

    cache.flush();

    expect(fs.rmSync).not.toHaveBeenCalled();
  });
});
