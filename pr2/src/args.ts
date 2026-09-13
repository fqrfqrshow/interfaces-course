// настройки программы
export interface Options {
    file: string;
    oper: string;
}

// разбор аргументов: -f <path> -o <oper>  или  --file <path> --oper <oper>
export function parseArgs(argv: string[]): Options | null {
    let file: string | null = null;
    let oper: string | null = null;

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '-f' || arg === '--file') {
            file = argv[i + 1] ?? null;
            i++;
        } else if (arg === '-o' || arg === '--oper') {
            oper = argv[i + 1] ?? null;
            i++;
        }
    }

    if (!file || !oper) return null;
    return { file, oper };
}