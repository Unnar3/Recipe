declare namespace NodeJS {
    // Merge the existing `ProcessEnv` definition with ours
    // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
    export interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        DB_USER: string;
        DB_PASSWORD: string;
        DB_HOST: string;
    }
}
