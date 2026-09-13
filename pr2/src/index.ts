import * as fs from 'fs';
import { Figure, figureToString } from './figures';
import { parseFigure } from './parser';
import { parseArgs } from './args';

// точка входа
function main(): void {
    // argv[0] = node, argv[1] = script, дальше наши аргументы
    const argv = process.argv.slice(2);
    const options = parseArgs(argv);

    if (options === null) {
        console.error('ошибка: неверные аргументы');
        console.error('использование: -f <файл> -o <операция>');
        console.error('  операции: print, count');
        process.exit(1);
        return;
    }

    if (options.oper !== 'print' && options.oper !== 'count') {
        console.error(`ошибка: неизвестная операция "${options.oper}"`);
        console.error('доступны: print, count');
        process.exit(1);
        return;
    }

    // читаем файл
    let content = '';
    try {
        content = fs.readFileSync(options.file, 'utf-8');
    } catch (e) {
        console.error(`ошибка: не удалось прочитать файл "${options.file}"`);
        process.exit(1);
        return;
    }

    // парсим строки
    const lines = content.split(/\r?\n/);
    const figures: Figure[] = [];
    let skipped = 0;

    for (const line of lines) {
        if (line.trim().length === 0) continue;
        const fig = parseFigure(line);
        if (fig === null) {
            skipped++;
            continue;
        }
        figures.push(fig);
    }

    // выполняем операцию
    if (options.oper === 'print') {
        for (const fig of figures) {
            console.log(figureToString(fig));
        }
        if (skipped > 0) {
            console.error(`пропущено некорректных строк: ${skipped}`);
        }
    } else if (options.oper === 'count') {
        console.log(figures.length);
    }
}

main();