// Основной JavaScript файл для интерактивности приложения

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initNavigation();
    initTabs();
    initSidebar();
    initAnimations();
    initCycleVisualization();
});

// Навигация между секциями
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Убираем активный класс со всех ссылок и секций
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Добавляем активный класс к текущей ссылке и секции
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // Плавная прокрутка наверх
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// Система табов
function initTabs() {
    const tabContainers = document.querySelectorAll('.types-tabs, .examples-tabs');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabPanels = container.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Убираем активный класс со всех кнопок и панелей в этом контейнере
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Добавляем активный класс к текущей кнопке и панели
                this.classList.add('active');
                const targetPanel = container.querySelector(`#${targetTab}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    });
}

// Боковая панель для мобильных устройств
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Закрытие сайдбара при клике на основной контент на мобильных
    if (window.innerWidth <= 768) {
        mainContent.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });
}

// Анимации при скролле
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами для анимации
    const animatedElements = document.querySelectorAll('.info-card, .step-card, .cycle-level, .source-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Интерактивная визуализация цикла адаптации
function initCycleVisualization() {
    const cycleSteps = document.querySelectorAll('.cycle-step');
    let currentStep = 0;
    
    function highlightStep(stepIndex) {
        cycleSteps.forEach((step, index) => {
            if (index === stepIndex) {
                step.style.transform = 'scale(1.1)';
                step.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                step.style.zIndex = '10';
            } else {
                step.style.transform = 'scale(1)';
                step.style.boxShadow = '';
                step.style.zIndex = '1';
            }
        });
    }
    
    // Автоматическое выделение шагов
    function autoHighlight() {
        highlightStep(currentStep);
        currentStep = (currentStep + 1) % cycleSteps.length;
    }
    
    // Запуск автоматического выделения каждые 2 секунды
    if (cycleSteps.length > 0) {
        setInterval(autoHighlight, 2000);
        
        // Обработка кликов по шагам
        cycleSteps.forEach((step, index) => {
            step.addEventListener('click', function() {
                currentStep = index;
                highlightStep(currentStep);
            });
        });
    }
}

// Утилиты для работы с данными
const PeriodizationUtils = {
    // Расчет интенсивности на основе цели
    calculateIntensity: function(goal, week, totalWeeks) {
        const progressRatio = week / totalWeeks;
        
        switch(goal) {
            case 'mass':
                return 60 + (progressRatio * 15); // 60-75%
            case 'strength':
                return 70 + (progressRatio * 20); // 70-90%
            case 'endurance':
                return 50 + (progressRatio * 20); // 50-70%
            case 'power':
                return 80 + (progressRatio * 15); // 80-95%
            default:
                return 70;
        }
    },
    
    // Расчет объема на основе цели
    calculateVolume: function(goal, week, totalWeeks) {
        const progressRatio = week / totalWeeks;
        
        switch(goal) {
            case 'mass':
                return Math.round(12 - (progressRatio * 4)); // 12-8 повторений
            case 'strength':
                return Math.round(8 - (progressRatio * 3)); // 8-5 повторений
            case 'endurance':
                return Math.round(15 - (progressRatio * 3)); // 15-12 повторений
            case 'power':
                return Math.round(5 - (progressRatio * 2)); // 5-3 повторения
            default:
                return 8;
        }
    },
    
    // Определение типа периодизации на основе уровня
    getPeriodizationType: function(level) {
        switch(level) {
            case 'beginner':
                return 'linear';
            case 'intermediate':
                return 'nonlinear';
            case 'advanced':
                return 'dup';
            default:
                return 'linear';
        }
    },
    
    // Генерация рекомендаций
    generateRecommendations: function(goal, level, duration) {
        const recommendations = [];
        
        if (level === 'beginner') {
            recommendations.push('Начните с базовых упражнений и изучения техники');
            recommendations.push('Увеличивайте нагрузку постепенно');
            recommendations.push('Уделяйте особое внимание восстановлению');
        }
        
        if (goal === 'mass') {
            recommendations.push('Обеспечьте достаточное потребление белка (1.6-2.2 г/кг веса)');
            recommendations.push('Поддерживайте калорийный профицит');
        }
        
        if (goal === 'strength') {
            recommendations.push('Фокусируйтесь на базовых многосуставных упражнениях');
            recommendations.push('Увеличивайте интенсивность постепенно');
        }
        
        if (duration > 16) {
            recommendations.push('Планируйте разгрузочные недели каждые 4-6 недель');
            recommendations.push('Варьируйте упражнения для предотвращения адаптации');
        }
        
        return recommendations;
    }
};

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Ошибка в приложении:', e.error);
});

// Сохранение состояния в localStorage
function saveAppState() {
    const activeSection = document.querySelector('.nav-link.active')?.getAttribute('data-section');
    if (activeSection) {
        localStorage.setItem('periodization-app-section', activeSection);
    }
}

// Восстановление состояния из localStorage
function restoreAppState() {
    const savedSection = localStorage.getItem('periodization-app-section');
    if (savedSection) {
        const targetLink = document.querySelector(`[data-section="${savedSection}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// Сохранение состояния при уходе со страницы
window.addEventListener('beforeunload', saveAppState);

// Восстановление состояния при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(restoreAppState, 100);
});

// Экспорт утилит для использования в других файлах
window.PeriodizationUtils = PeriodizationUtils;

