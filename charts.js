// Графики и диаграммы для визуализации периодизации

document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});

function initCharts() {
    // Инициализация графиков для примеров схем
    createMassChart();
    createStrengthChart();
    createDUPChart();
}

// График для 12-недельной схемы набора массы
function createMassChart() {
    const ctx = document.getElementById('massChart');
    if (!ctx) return;
    
    const weeks = Array.from({length: 12}, (_, i) => i + 1);
    const intensityData = weeks.map(week => {
        if (week <= 4) return 65;
        if (week <= 8) return 77.5;
        return 87.5;
    });
    
    const volumeData = weeks.map(week => {
        if (week <= 4) return 11;
        if (week <= 8) return 7;
        return 4;
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `Неделя ${w}`),
            datasets: [{
                label: 'Интенсивность (%)',
                data: intensityData,
                borderColor: '#3182ce',
                backgroundColor: 'rgba(49, 130, 206, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Объем (повторения)',
                data: volumeData,
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 137, 54, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Недели'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Интенсивность (%)'
                    },
                    min: 50,
                    max: 100
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Объем (повторения)'
                    },
                    min: 0,
                    max: 15,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Прогрессия интенсивности и объема'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// График для 8-недельного блочного цикла на силу
function createStrengthChart() {
    const ctx = document.getElementById('strengthChart');
    if (!ctx) return;
    
    const weeks = Array.from({length: 8}, (_, i) => i + 1);
    const intensityData = weeks.map(week => {
        if (week <= 4) return 65; // Аккумуляция
        if (week <= 7) return 85; // Трансмутация
        return 95; // Реализация
    });
    
    const volumeData = weeks.map(week => {
        if (week <= 4) return 10;
        if (week <= 7) return 5;
        return 2;
    });
    
    const phaseColors = weeks.map(week => {
        if (week <= 4) return 'rgba(56, 161, 105, 0.8)'; // Зеленый для аккумуляции
        if (week <= 7) return 'rgba(237, 137, 54, 0.8)'; // Оранжевый для трансмутации
        return 'rgba(229, 62, 62, 0.8)'; // Красный для реализации
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeks.map(w => `Неделя ${w}`),
            datasets: [{
                label: 'Интенсивность (%)',
                data: intensityData,
                backgroundColor: phaseColors,
                borderColor: phaseColors.map(color => color.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Интенсивность (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Блочная периодизация: Фазы тренировки'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const week = context.dataIndex + 1;
                            if (week <= 4) return 'Фаза: Аккумуляция';
                            if (week <= 7) return 'Фаза: Трансмутация';
                            return 'Фаза: Реализация';
                        }
                    }
                }
            }
        }
    });
}

// График для DUP на 6 недель
function createDUPChart() {
    const ctx = document.getElementById('dupChart');
    if (!ctx) return;
    
    const weeks = Array.from({length: 6}, (_, i) => i + 1);
    
    // DUP паттерн: день 1 (сила), день 2 (гипертрофия), день 3 (выносливость)
    const day1Data = [85, 80, 85, 80, 90, 85];
    const day2Data = [70, 65, 70, 65, 75, 70];
    const day3Data = [60, 55, 60, 55, 65, 60];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `Неделя ${w}`),
            datasets: [{
                label: 'День 1 (Сила)',
                data: day1Data,
                borderColor: '#e53e3e',
                backgroundColor: 'rgba(229, 62, 62, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#e53e3e',
                pointBorderColor: '#e53e3e',
                pointRadius: 6
            }, {
                label: 'День 2 (Гипертрофия)',
                data: day2Data,
                borderColor: '#3182ce',
                backgroundColor: 'rgba(49, 130, 206, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#3182ce',
                pointBorderColor: '#3182ce',
                pointRadius: 6
            }, {
                label: 'День 3 (Выносливость)',
                data: day3Data,
                borderColor: '#38a169',
                backgroundColor: 'rgba(56, 161, 105, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#38a169',
                pointBorderColor: '#38a169',
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Интенсивность (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'DUP: Ежедневные вариации интенсивности'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Создание персонального графика для калькулятора
function createPersonalChart(program) {
    const ctx = document.getElementById('personalChart');
    if (!ctx) return;
    
    // Очистка предыдущего графика
    Chart.getChart(ctx)?.destroy();
    
    const weeks = program.weeks.map(w => w.week);
    const intensityData = program.weeks.map(w => w.intensity);
    const volumeData = program.weeks.map(w => w.volume);
    
    // Цвета для разгрузочных недель
    const backgroundColors = program.weeks.map(w => 
        w.isDeload ? 'rgba(237, 137, 54, 0.3)' : 'rgba(49, 130, 206, 0.1)'
    );
    
    const borderColors = program.weeks.map(w => 
        w.isDeload ? '#ed8936' : '#3182ce'
    );
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `Неделя ${w}`),
            datasets: [{
                label: 'Интенсивность (%)',
                data: intensityData,
                borderColor: '#3182ce',
                backgroundColor: backgroundColors,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: borderColors,
                pointBorderColor: borderColors,
                pointRadius: 5,
                yAxisID: 'y'
            }, {
                label: 'Объем (повторения)',
                data: volumeData,
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 137, 54, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Недели программы'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Интенсивность (%)'
                    },
                    min: 50,
                    max: 100
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Объем (повторения)'
                    },
                    min: 0,
                    max: Math.max(...volumeData) + 5,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Ваша персональная программа (${getPeriodizationTypeName(program.type)})`
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const weekData = program.weeks[context.dataIndex];
                            return [
                                `Фокус: ${weekData.focus}`,
                                `Вес: ${weekData.weight} кг`,
                                weekData.isDeload ? 'Разгрузочная неделя' : ''
                            ].filter(Boolean);
                        }
                    }
                }
            }
        }
    });
}

// Утилитарная функция для получения названия типа периодизации
function getPeriodizationTypeName(type) {
    const names = {
        'linear': 'Линейная периодизация',
        'nonlinear': 'Нелинейная периодизация',
        'dup': 'DUP периодизация',
        'block': 'Блочная периодизация'
    };
    return names[type] || type;
}

// Создание интерактивной диаграммы сравнения типов периодизации
function createComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Эффективность для новичков', 'Эффективность для продвинутых', 'Вариативность', 'Сложность планирования', 'Предотвращение плато'],
            datasets: [{
                label: 'Линейная',
                data: [9, 6, 3, 8, 5],
                borderColor: '#3182ce',
                backgroundColor: 'rgba(49, 130, 206, 0.2)',
                pointBackgroundColor: '#3182ce'
            }, {
                label: 'Нелинейная',
                data: [7, 8, 8, 6, 8],
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 137, 54, 0.2)',
                pointBackgroundColor: '#ed8936'
            }, {
                label: 'DUP',
                data: [6, 9, 9, 7, 9],
                borderColor: '#38a169',
                backgroundColor: 'rgba(56, 161, 105, 0.2)',
                pointBackgroundColor: '#38a169'
            }, {
                label: 'Блочная',
                data: [5, 9, 6, 9, 8],
                borderColor: '#e53e3e',
                backgroundColor: 'rgba(229, 62, 62, 0.2)',
                pointBackgroundColor: '#e53e3e'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Сравнение типов периодизации'
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Экспорт функций для использования в других модулях
window.createPersonalChart = createPersonalChart;
window.createComparisonChart = createComparisonChart;

