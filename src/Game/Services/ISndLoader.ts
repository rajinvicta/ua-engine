
interface ISndLoader {
    loadSounds(urls: string[], extensions: string[], onProgress: Function, onComplete: Function, context: any): void;
    baseURL: string;
}

export default ISndLoader;