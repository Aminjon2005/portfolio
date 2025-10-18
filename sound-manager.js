/**
 * Sound Manager для Block Blast Game
 * Управление звуковыми эффектами и музыкой
 */

class SoundManager {
    constructor() {
        this.sounds = {};
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.currentMusic = null;
        this.volume = 0.7;
        this.init();
    }

    /**
     * Инициализация звукового менеджера
     */
    init() {
        this.createAudioContext();
        this.loadSounds();
        this.setupVolumeControls();
    }

    /**
     * Создание аудио контекста
     */
    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API не поддерживается:', error);
            this.audioContext = null;
        }
    }

    /**
     * Загрузка звуковых эффектов
     */
    loadSounds() {
        // Создаем звуки программно, так как у нас нет аудио файлов
        this.sounds = {
            place: this.createTone(440, 0.1, 'sine'),      // Звук размещения блока
            clear: this.createTone(880, 0.3, 'sawtooth'),  // Звук очистки линии
            bonus: this.createTone(660, 0.2, 'square'),    // Звук бонуса
            gameOver: this.createTone(220, 0.5, 'triangle'), // Звук окончания игры
            levelUp: this.createTone(1320, 0.4, 'sine'),   // Звук повышения уровня
            click: this.createTone(800, 0.05, 'sine')      // Звук клика
        };
    }

    /**
     * Создание тона
     */
    createTone(frequency, duration, type = 'sine') {
        return {
            frequency: frequency,
            duration: duration,
            type: type,
            play: () => this.playTone(frequency, duration, type)
        };
    }

    /**
     * Воспроизведение тона
     */
    playTone(frequency, duration, type = 'sine') {
        if (!this.soundEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Ошибка воспроизведения звука:', error);
        }
    }

    /**
     * Воспроизведение звука размещения блока
     */
    playPlaceSound() {
        if (this.sounds.place) {
            this.sounds.place.play();
        }
    }

    /**
     * Воспроизведение звука очистки линии
     */
    playClearSound() {
        if (this.sounds.clear) {
            this.sounds.clear.play();
        }
    }

    /**
     * Воспроизведение звука бонуса
     */
    playBonusSound() {
        if (this.sounds.bonus) {
            this.sounds.bonus.play();
        }
    }

    /**
     * Воспроизведение звука окончания игры
     */
    playGameOverSound() {
        if (this.sounds.gameOver) {
            this.sounds.gameOver.play();
        }
    }

    /**
     * Воспроизведение звука повышения уровня
     */
    playLevelUpSound() {
        if (this.sounds.levelUp) {
            this.sounds.levelUp.play();
        }
    }

    /**
     * Воспроизведение звука клика
     */
    playClickSound() {
        if (this.sounds.click) {
            this.sounds.click.play();
        }
    }

    /**
     * Воспроизведение мелодии
     */
    playMelody(notes, tempo = 200) {
        if (!this.soundEnabled || !this.audioContext) return;

        notes.forEach((note, index) => {
            const time = this.audioContext.currentTime + (index * tempo / 1000);
            this.playNoteAtTime(note.frequency, note.duration, note.type, time);
        });
    }

    /**
     * Воспроизведение ноты в определенное время
     */
    playNoteAtTime(frequency, duration, type = 'sine', time) {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, time);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, time + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

            oscillator.start(time);
            oscillator.stop(time + duration);
        } catch (error) {
            console.warn('Ошибка воспроизведения ноты:', error);
        }
    }

    /**
     * Воспроизведение фоновой музыки
     */
    playBackgroundMusic() {
        if (!this.musicEnabled || !this.audioContext) return;

        // Простая мелодия для фоновой музыки
        const melody = [
            { frequency: 523.25, duration: 0.5, type: 'sine' }, // C5
            { frequency: 587.33, duration: 0.5, type: 'sine' }, // D5
            { frequency: 659.25, duration: 0.5, type: 'sine' }, // E5
            { frequency: 698.46, duration: 0.5, type: 'sine' }, // F5
            { frequency: 783.99, duration: 0.5, type: 'sine' }, // G5
            { frequency: 880.00, duration: 0.5, type: 'sine' }, // A5
            { frequency: 987.77, duration: 0.5, type: 'sine' }, // B5
            { frequency: 1046.50, duration: 1.0, type: 'sine' } // C6
        ];

        this.playMelody(melody, 300);
        
        // Повторяем мелодию через 4 секунды
        setTimeout(() => {
            if (this.musicEnabled) {
                this.playBackgroundMusic();
            }
        }, 4000);
    }

    /**
     * Остановка фоновой музыки
     */
    stopBackgroundMusic() {
        this.musicEnabled = false;
    }

    /**
     * Настройка элементов управления громкостью
     */
    setupVolumeControls() {
        // Создаем элементы управления звуком
        const soundControls = document.createElement('div');
        soundControls.id = 'sound-controls';
        soundControls.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 8px;
            color: white;
        `;

        soundControls.innerHTML = `
            <div style="margin-bottom: 5px;">
                <label>
                    <input type="checkbox" id="soundToggle" ${this.soundEnabled ? 'checked' : ''}>
                    Звук
                </label>
            </div>
            <div style="margin-bottom: 5px;">
                <label>
                    <input type="checkbox" id="musicToggle" ${this.musicEnabled ? 'checked' : ''}>
                    Музыка
                </label>
            </div>
            <div>
                <label>
                    Громкость: 
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="${this.volume}">
                </label>
            </div>
        `;

        document.body.appendChild(soundControls);

        // Обработчики событий
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });

        document.getElementById('musicToggle').addEventListener('change', (e) => {
            this.musicEnabled = e.target.checked;
            if (this.musicEnabled) {
                this.playBackgroundMusic();
            }
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.volume = parseFloat(e.target.value);
        });
    }

    /**
     * Включение/выключение звука
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        document.getElementById('soundToggle').checked = this.soundEnabled;
    }

    /**
     * Включение/выключение музыки
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        document.getElementById('musicToggle').checked = this.musicEnabled;
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        }
    }

    /**
     * Установка громкости
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        const slider = document.getElementById('volumeSlider');
        if (slider) {
            slider.value = this.volume;
        }
    }

    /**
     * Получение состояния звука
     */
    getSoundState() {
        return {
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled,
            volume: this.volume
        };
    }
}

// Создаем глобальный экземпляр звукового менеджера
window.soundManager = new SoundManager();