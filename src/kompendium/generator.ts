import { JsonDocs } from "@stencil/core/internal";
import { KompendiumConfig, defaultConfig, KompendiumData } from "./config";
import { addSources } from "./source";
import lnk from 'lnk';
import { createMenu } from "./menu";
import { exists, mkdir, readFile, writeFile } from "./filesystem";
import { createWatcher } from "./watch";

export const kompendium = (config: Partial<KompendiumConfig> = {}) => {
    config = {
        ...defaultConfig,
        ...config
    };
    initialize(config);

    return async (docs: JsonDocs) => {
        const data: KompendiumData = {
            docs: await addSources(docs),
            title: await getProjectTitle(config),
            menu: createMenu(docs)
        };

        await writeData(config, data);
    }
}

async function initialize(config: Partial<KompendiumConfig>) {
    const path = `${config.publicPath}/kompendium.json`;
    createWatcher(path, 'unlink', onUnlink(config));
}

const onUnlink = (config: Partial<KompendiumConfig>) => () => {
    createSymlink(config);
}

async function createSymlink(config: Partial<KompendiumConfig>) {
    const source = `${config.path}/kompendium.json`;
    const target = `${config.publicPath}/kompendium.json`;

    if (!await exists(source)) {
        return;
    }

    if (await exists(target)) {
        return;
    }

    lnk([source], config.publicPath);
}


async function getProjectTitle(config: Partial<KompendiumConfig>): Promise<string> {
    if (config.title) {
        return config.title;
    }

    const json = await readFile('./package.json');
    const data = JSON.parse(json);

    return data.name.split('-').join(' ');
}

async function writeData(config: Partial<KompendiumConfig>, data: KompendiumData) {
    const filePath = `${config.path}/kompendium.json`;

    if (!await exists(config.path)) {
        mkdir(config.path, { recursive: true });
    }

    await writeFile(filePath, JSON.stringify(data));
    createSymlink(config);
}
