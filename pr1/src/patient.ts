import * as readline from 'readline';

// структура даты
interface Date {
    dd: number;
    mm: number;
    yyyy: number;
}

// структура пациента
interface Patient {
    passport: string;
    name: string;
    birth_date: Date;
    phone: string;
    temperature: number;
}

// интерфейс для чтения строк из консоли
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// обёртка над question, чтобы работал await
function ask(question: string): Promise<string> {
    return new Promise((resolve) => rl.question(question, resolve));
}

// проверка даты на существование
function isValidDate(dd: number, mm: number, yyyy: number): boolean {
    if (yyyy < 1900 || yyyy > 2100) return false;
    if (mm < 1 || mm > 12) return false;
    if (dd < 1 || dd > 31) return false;

    // дней в месяцах
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // проверка високосного года
    const leap = (yyyy % 4 === 0 && yyyy % 100 !== 0) || yyyy % 400 === 0;
    if (leap) daysInMonth[1] = 29;

    return dd <= daysInMonth[mm - 1];
}

// ввод паспорта
async function inputPassport(): Promise<string> {
    const pattern = /^\d{2} \d{2}-\d{6}$/;
    while (true) {
        const value = (await ask('введите паспорт (ss ss-nnnnnn): ')).trim();
        if (pattern.test(value)) return value;
        console.log('ошибка: неверный формат паспорта, попробуйте снова');
    }
}

// ввод фио
async function inputName(): Promise<string> {
    const pattern = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё \-]*$/;
    while (true) {
        const value = (await ask('введите фио: ')).trim();
        if (value.length === 0) {
            console.log('ошибка: строка не может быть пустой');
            continue;
        }
        if (pattern.test(value)) return value;
        console.log('ошибка: фио может содержать только буквы, пробелы и дефис');
    }
}

// ввод даты рождения
async function inputBirthDate(): Promise<Date> {
    const pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    while (true) {
        const value = (await ask('введите дату рождения (yyyy-mm-dd): ')).trim();
        const m = value.match(pattern);
        if (!m) {
            console.log('  ошибка: неверный формат даты, нужен yyyy-mm-dd');
            continue;
        }
        // вытаскиваем год, месяц, день
        const yyyy = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10);
        const dd = parseInt(m[3], 10);
        if (isValidDate(dd, mm, yyyy)) return { dd, mm, yyyy };
        console.log('ошибка: такой даты не существует');
    }
}

// ввод телефона
async function inputPhone(): Promise<string> {
    // формат +X(XXX) XXX-XX-XX
    const p1 = /^\+\d\(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    // формат X(XXX) XXX-XXXX
    const p2 = /^\d\(\d{3}\) \d{3}-\d{4}$/;
    while (true) {
        const value = (await ask('введите телефон (+X(XXX) XXX-XX-XX или X(XXX) XXX-XXXX): ')).trim();
        if (p1.test(value) || p2.test(value)) return value;
        console.log('  ошибка: неверный формат телефона');
    }
}

// ввод температуры
async function inputTemperature(): Promise<number> {
    const pattern = /^\d{1,2}\.\d{2}$/;
    while (true) {
        const value = (await ask('введите температуру (XX.XX, напр. 36.60): ')).trim();
        if (!pattern.test(value)) {
            console.log('  ошибка: неверный формат температуры, нужно XX.XX');
            continue;
        }
        const t = parseFloat(value);
        // диапазон 30.00 - 45.00
        if (t < 30.0 || t > 45.0) {
            console.log('  ошибка: температура должна быть в диапазоне 30.00-45.00');
            continue;
        }
        return t;
    }
}

// главная функция
async function main(): Promise<void> {
    console.log('=== ввод данных о пациенте ===');

    // заполняем структуру по полям
    const p: Patient = {
        passport:    await inputPassport(),
        name:        await inputName(),
        birth_date:  await inputBirthDate(),
        phone:       await inputPhone(),
        temperature: await inputTemperature(),
    };

    // добавляем ведущий ноль к дню и месяцу
    const dd = String(p.birth_date.dd).padStart(2, '0');
    const mm = String(p.birth_date.mm).padStart(2, '0');

    console.log('\n=== введённые данные ===');
    console.log(`паспорт:     ${p.passport}`);
    console.log(`фио:         ${p.name}`);
    console.log(`дата рожд.:  ${p.birth_date.yyyy}-${mm}-${dd}`);
    console.log(`телефон:     ${p.phone}`);
    console.log(`температура: ${p.temperature.toFixed(2)}`);

    // закрываем ввод
    rl.close();
}

// запуск и обработка ошибок
main().catch((e) => {
    console.error('критическая ошибка:', e);
    rl.close();
});