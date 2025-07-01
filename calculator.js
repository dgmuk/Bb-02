// Калькулятор периодизации тренировочного процесса

document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
});

function initCalculator() {
    const generateButton = document.getElementById('generateProgram');
    const exportButton = document.getElementById('exportProgram');
    const resultsContainer = document.getElementById('calculatorResults');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateProgram);
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', exportProgram);
    }
}

function generateProgram() {
    // Получение данных из формы
    const formData = {
        goal: document.getElementById('goal').value,
        level: document.getElementById('level').value,
        duration: parseInt(document.getElementById('duration').value),
        oneRM: parseInt(document.getElementById('oneRM').value),
        frequency: parseInt(document.getElementById('frequency').value)
    };
    
    // Валидация данных
    if (!validateFormData(formData)) {
        alert('Пожалуйста, заполните все поля корректно');
        return;
    }
    
    // Генерация программы
    const program = createPeriodizationProgram(formData);
    
    // Отображение результатов
    displayResults(program, formData);
    
    // Показ контейнера с результатами
    document.getElementById('calculatorResults').style.display = 'block';
    
    // Создание графика
    createPersonalChart(program);
}

function validateFormData(data) {
    return data.goal && data.level && 
           data.duration >= 4 && data.duration <= 52 &&
           data.oneRM >= 20 && data.oneRM <= 500 &&
           data.frequency >= 3 && data.frequency <= 6;
}

function createPeriodizationProgram(formData) {
    const { goal, level, duration, oneRM, frequency } = formData;
    const periodizationType = PeriodizationUtils.getPeriodizationType(level);
    
    const program = {
        type: periodizationType,
        goal: goal,
        level: level,
        duration: duration,
        frequency: frequency,
        oneRM: oneRM,
        weeks: [],
        recommendations: PeriodizationUtils.generateRecommendations(goal, level, duration)
    };
    
    // Генерация недельных планов
    for (let week = 1; week <= duration; week++) {
        const weekPlan = generateWeekPlan(week, formData, periodizationType);
        program.weeks.push(weekPlan);
    }
    
    return program;
}

function generateWeekPlan(weekNumber, formData, periodizationType) {
    const { goal, duration, oneRM, frequency } = formData;
    
    let intensity, volume, focus;
    
    switch (periodizationType) {
        case 'linear':
            intensity = PeriodizationUtils.calculateIntensity(goal, weekNumber, duration);
            volume = PeriodizationUtils.calculateVolume(goal, weekNumber, duration);
            focus = getLinearFocus(weekNumber, duration);
            break;
            
        case 'nonlinear':
            intensity = getNonlinearIntensity(weekNumber);
            volume = getNonlinearVolume(weekNumber);
            focus = getNonlinearFocus(weekNumber);
            break;
            
        case 'dup':
            return generateDUPWeek(weekNumber, formData);
            
        default:
            intensity = 70;
            volume = 8;
            focus = 'Общая подготовка';
    }
    
    const weight = Math.round(oneRM * (intensity / 100));
    const isDeloadWeek = weekNumber % 4 === 0 && weekNumber > 4;
    
    if (isDeloadWeek) {
        intensity *= 0.8;
        volume = Math.max(3, Math.round(volume * 0.6));
        focus = 'Восстановление';
    }
    
    return {
        week: weekNumber,
        intensity: Math.round(intensity),
        volume: volume,
        weight: Math.round(oneRM * (intensity / 100)),
        focus: focus,
        isDeload: isDeloadWeek,
        sessions: generateSessionsForWeek(frequency, intensity, volume, oneRM)
    };
}

function generateDUPWeek(weekNumber, formData) {
    const { oneRM, frequency } = formData;
    const sessions = [];
    
    // DUP паттерн: Сила, Гипертрофия, Выносливость
    const dupPattern = [
        { intensity: 85, volume: 5, focus: 'Сила' },
        { intensity: 70, volume: 10, focus: 'Гипертрофия' },
        { intensity: 60, volume: 15, focus: 'Выносливость' }
    ];
    
    for (let session = 0; session < frequency; session++) {
        const pattern = dupPattern[session % dupPattern.length];
        sessions.push({
            session: session + 1,
            intensity: pattern.intensity,
            volume: pattern.volume,
            weight: Math.round(oneRM * (pattern.intensity / 100)),
            focus: pattern.focus
        });
    }
    
    return {
        week: weekNumber,
        intensity: 72, // Средняя интенсивность
        volume: 10, // Средний объем
        weight: Math.round(oneRM * 0.72),
        focus: 'DUP (Ежедневные вариации)',
        isDeload: weekNumber % 6 === 0,
        sessions: sessions
    };
}

function generateSessionsForWeek(frequency, intensity, volume, oneRM) {
    const sessions = [];
    const baseIntensity = intensity;
    
    for (let session = 1; session <= frequency; session++) {
        let sessionIntensity = baseIntensity;
        let sessionVolume = volume;
        let sessionFocus = '';
        
        // Вариация интенсивности в течение недели
        switch (session % 3) {
            case 1: // Тяжелая тренировка
                sessionIntensity = baseIntensity;
                sessionFocus = 'Тяжелая';
                break;
            case 2: // Средняя тренировка
                sessionIntensity = baseIntensity * 0.9;
                sessionVolume = Math.round(volume * 1.2);
                sessionFocus = 'Средняя';
                break;
            case 0: // Легкая тренировка
                sessionIntensity = baseIntensity * 0.8;
                sessionVolume = Math.round(volume * 1.4);
                sessionFocus = 'Легкая';
                break;
        }
        
        sessions.push({
            session: session,
            intensity: Math.round(sessionIntensity),
            volume: sessionVolume,
            weight: Math.round(oneRM * (sessionIntensity / 100)),
            focus: sessionFocus
        });
    }
    
    return sessions;
}

function getLinearFocus(week, totalWeeks) {
    const progress = week / totalWeeks;
    
    if (progress <= 0.4) return 'Гипертрофия';
    if (progress <= 0.7) return 'Сила';
    if (progress <= 0.9) return 'Мощность';
    return 'Пик';
}

function getNonlinearIntensity(week) {
    const patterns = [75, 85, 65, 80];
    return patterns[(week - 1) % patterns.length];
}

function getNonlinearVolume(week) {
    const patterns = [8, 5, 12, 6];
    return patterns[(week - 1) % patterns.length];
}

function getNonlinearFocus(week) {
    const patterns = ['Сила', 'Мощность', 'Гипертрофия', 'Сила'];
    return patterns[(week - 1) % patterns.length];
}

function displayResults(program, formData) {
    const outputContainer = document.getElementById('programOutput');
    
    let html = `
        <div class="program-summary">
            <h4>Параметры программы</h4>
            <div class="summary-grid">
                <div class="summary-item">
                    <span class="label">Тип периодизации:</span>
                    <span class="value">${getPeriodizationTypeName(program.type)}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Цель:</span>
                    <span class="value">${getGoalName(program.goal)}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Продолжительность:</span>
                    <span class="value">${program.duration} недель</span>
                </div>
                <div class="summary-item">
                    <span class="label">Частота:</span>
                    <span class="value">${program.frequency} раз в неделю</span>
                </div>
            </div>
        </div>
        
        <div class="program-table">
            <h4>План тренировок</h4>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Неделя</th>
                            <th>Интенсивность (%)</th>
                            <th>Объем (повт.)</th>
                            <th>Вес (кг)</th>
                            <th>Фокус</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    program.weeks.forEach(week => {
        const rowClass = week.isDeload ? 'deload-week' : '';
        html += `
            <tr class="${rowClass}">
                <td>${week.week}</td>
                <td>${week.intensity}%</td>
                <td>${week.volume}</td>
                <td>${week.weight}</td>
                <td>${week.focus}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="recommendations">
            <h4>Рекомендации</h4>
            <ul>
    `;
    
    program.recommendations.forEach(rec => {
        html += `<li>${rec}</li>`;
    });
    
    html += `
            </ul>
        </div>
    `;
    
    outputContainer.innerHTML = html;
    
    // Добавляем стили для разгрузочных недель
    const style = document.createElement('style');
    style.textContent = `
        .program-summary {
            background: rgba(49, 130, 206, 0.1);
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .summary-item .label {
            font-weight: 600;
            color: var(--text-secondary);
        }
        
        .summary-item .value {
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .program-table {
            margin: 1.5rem 0;
        }
        
        .deload-week {
            background-color: rgba(237, 137, 54, 0.1) !important;
            font-weight: 600;
        }
        
        .recommendations {
            background: rgba(56, 161, 105, 0.1);
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-top: 1.5rem;
        }
        
        .recommendations ul {
            margin-top: 1rem;
            padding-left: 1.5rem;
        }
        
        .recommendations li {
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
}

function getPeriodizationTypeName(type) {
    const names = {
        'linear': 'Линейная',
        'nonlinear': 'Нелинейная',
        'dup': 'DUP (Ежедневно-волнообразная)',
        'block': 'Блочная'
    };
    return names[type] || type;
}

function getGoalName(goal) {
    const names = {
        'mass': 'Набор мышечной массы',
        'strength': 'Увеличение силы',
        'endurance': 'Развитие выносливости',
        'power': 'Развитие мощности'
    };
    return names[goal] || goal;
}

function exportProgram() {
    // Простая реализация экспорта в текстовый формат
    const programData = document.getElementById('programOutput').innerText;
    const blob = new Blob([programData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'periodization-program.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Показываем уведомление
    showNotification('Программа экспортирована!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавляем CSS анимации для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

