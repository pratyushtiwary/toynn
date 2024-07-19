interface RegistryData {
    [key: string]:
        | {
              name: string;
              cachedAt: number;
              content: string;
          }
        | undefined;
}

export default function createMockCache(registryData: RegistryData) {
    return {
        loadRegistry: jest.fn(() => {
            return registryData;
        }),
        saveRegistry: jest.fn((registry: RegistryData) => {
            registryData = registry;
        }),
        entryExpired: jest.fn((registry: RegistryData, name: string) => {
            return registry[name]?.cachedAt === 0;
        }),
        clean: jest.fn(() => {}),
        delete: jest.fn((registry: object, name: string) => {
            delete registry[name];

            return registry;
        }),
        save: jest.fn((name: string, content: string) => {
            registryData[name] = {
                name: name,
                cachedAt: 0,
                content,
            };

            return registryData[name];
        }),
        load: jest.fn((name: string) => {
            const data = registryData[name];

            if (data?.cachedAt !== 0) {
                return data;
            }
            return undefined;
        }),
    };
}
