import fs from 'fs';

export function exists(path: string) {
    return new Promise(resolve => {
        fs.access(path, fs.constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}

export function mkdir(path: string, options: any = {}) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, options, (error, path) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(path);
            }
        });
    });
}

export function readFile(path: string, options: any = 'utf8') {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, options, (error, data: any) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}

export function writeFile(path: string, data: string, options: any = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
