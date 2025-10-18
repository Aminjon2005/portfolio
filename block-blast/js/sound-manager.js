// Менеджер звуков и музыки
class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.masterVolume = 0.7;
        this.soundVolume = 0.8;
        this.musicVolume = 0.5;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.createAudioContext();
        this.loadSounds();
    }
    
    // Загрузить настройки из localStorage
    loadSettings() {
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
        this.masterVolume = parseFloat(localStorage.getItem('masterVolume')) || 0.7;
        this.soundVolume = parseFloat(localStorage.getItem('soundVolume')) || 0.8;
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.5;
    }
    
    // Сохранить настройки в localStorage
    saveSettings() {
        localStorage.setItem('soundEnabled', this.soundEnabled);
        localStorage.setItem('musicEnabled', this.musicEnabled);
        localStorage.setItem('masterVolume', this.masterVolume);
        localStorage.setItem('soundVolume', this.soundVolume);
        localStorage.setItem('musicVolume', this.musicVolume);
    }
    
    // Создать аудио контекст
    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.masterVolume;
        } catch (error) {
            console.warn('Web Audio API not supported, falling back to HTML5 audio');
            this.audioContext = null;
        }
    }
    
    // Загрузить звуки (используем Web Audio API для генерации звуков)
    loadSounds() {
        // Генерируем звуки программно для избежания проблем с файлами
        this.generateSounds();
    }
    
    // Генерировать звуки программно
    generateSounds() {
        if (!this.audioContext) {
            // Fallback для браузеров без Web Audio API
            this.createHTMLAudioSounds();
            return;
        }
        
        // Звук размещения блока
        this.sounds.place = this.createToneSound(440, 0.1, 'sine');
        
        // Звук очистки линии
        this.sounds.lineClear = this.createToneSound(880, 0.3, 'square');
        
        // Звук комбо
        this.sounds.combo = this.createChordSound([523, 659, 784], 0.5);
        
        // Звук повышения уровня
        this.sounds.levelUp = this.createAscendingSound([440, 554, 659, 880], 0.8);
        
        // Звук окончания игры
        this.sounds.gameOver = this.createDescendingSound([880, 659, 440, 330], 1.0);
        
        // Звук нажатия кнопки
        this.sounds.button = this.createToneSound(330, 0.1, 'square');
        
        // Звук ошибки (невозможно разместить блок)
        this.sounds.error = this.createNoiseSound(0.2);
        
        // Фоновая музыка
        this.music.background = this.createBackgroundMusic();
    }
    
    // Создать простой тон
    createToneSound(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.audioContext || !this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    // Создать аккорд
    createChordSound(frequencies, duration) {
        return () => {
            if (!this.audioContext || !this.soundEnabled) return;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.2, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 100);
            });
        };
    }
    
    // Создать восходящий звук
    createAscendingSound(frequencies, duration) {
        return () => {
            if (!this.audioContext || !this.soundEnabled) return;
            
            const noteDuration = duration / frequencies.length;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteDuration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + noteDuration);
                }, index * noteDuration * 1000);
            });
        };
    }
    
    // Создать нисходящий звук
    createDescendingSound(frequencies, duration) {
        return () => {
            if (!this.audioContext || !this.soundEnabled) return;
            
            const noteDuration = duration / frequencies.length;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'sawtooth';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.4, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteDuration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + noteDuration);
                }, index * noteDuration * 1000);
            });
        };
    }
    
    // Создать шум (для звука ошибки)
    createNoiseSound(duration) {
        return () => {
            if (!this.audioContext || !this.soundEnabled) return;
            
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            source.buffer = buffer;
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            source.start(this.audioContext.currentTime);
        };
    }
    
    // Создать фоновую музыку
    createBackgroundMusic() {
        if (!this.audioContext) return null;
        
        // Простая мелодия для фона
        const melody = [523, 587, 659, 698, 784, 698, 659, 587]; // C, D, E, F, G, F, E, D
        let currentNote = 0;
        let musicInterval = null;
        
        return {
            start: () => {
                if (!this.musicEnabled || musicInterval) return;
                
                musicInterval = setInterval(() => {
                    if (!this.musicEnabled) return;
                    
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.frequency.setValueAtTime(melody[currentNote], this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.1, this.audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.8);
                    
                    currentNote = (currentNote + 1) % melody.length;
                }, 1000);
            },
            
            stop: () => {
                if (musicInterval) {
                    clearInterval(musicInterval);
                    musicInterval = null;
                }
            }
        };
    }
    
    // Создать HTML5 аудио звуки (fallback)
    createHTMLAudioSounds() {
        // Создаем простые звуки через data URLs
        this.sounds.place = () => this.playBeep(440, 100);
        this.sounds.lineClear = () => this.playBeep(880, 300);
        this.sounds.combo = () => {
            this.playBeep(523, 150);
            setTimeout(() => this.playBeep(659, 150), 100);
            setTimeout(() => this.playBeep(784, 150), 200);
        };
        this.sounds.levelUp = () => {
            [440, 554, 659, 880].forEach((freq, i) => {
                setTimeout(() => this.playBeep(freq, 200), i * 200);
            });
        };
        this.sounds.gameOver = () => {
            [880, 659, 440, 330].forEach((freq, i) => {
                setTimeout(() => this.playBeep(freq, 250), i * 250);
            });
        };
        this.sounds.button = () => this.playBeep(330, 100);
        this.sounds.error = () => this.playBeep(200, 200);
        
        this.music.background = {
            start: () => {},
            stop: () => {}
        };
    }
    
    // Воспроизвести простой beep (fallback)
    playBeep(frequency, duration) {
        if (!this.soundEnabled) return;
        
        // Создаем простой beep через oscillator без Web Audio API
        try {
            const audio = new Audio();
            const oscillator = new OscillatorNode(new AudioContext());
            oscillator.frequency.setValueAtTime(frequency, 0);
            oscillator.connect(new AudioContext().destination);
            oscillator.start();
            oscillator.stop(duration / 1000);
        } catch (error) {
            // Если и это не работает, просто игнорируем
            console.warn('Audio playback not available');
        }
    }
    
    // Воспроизвести звук
    playSound(soundName) {
        if (this.sounds[soundName] && this.soundEnabled) {
            try {
                this.sounds[soundName]();
            } catch (error) {
                console.warn('Error playing sound:', soundName, error);
            }
        }
    }
    
    // Запустить фоновую музыку
    startBackgroundMusic() {
        if (this.music.background && this.musicEnabled) {
            this.music.background.start();
        }
    }
    
    // Остановить фоновую музыку
    stopBackgroundMusic() {
        if (this.music.background) {
            this.music.background.stop();
        }
    }
    
    // Переключить звуки
    toggleSound(enabled) {
        this.soundEnabled = enabled;
        this.saveSettings();
        
        if (!enabled) {
            // Останавливаем все текущие звуки
            if (this.audioContext) {
                this.audioContext.suspend();
            }
        } else {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }
    }
    
    // Переключить музыку
    toggleMusic(enabled) {
        this.musicEnabled = enabled;
        this.saveSettings();
        
        if (enabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }
    
    // Установить общую громкость
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
        this.saveSettings();
    }
    
    // Установить громкость звуков
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    // Установить громкость музыки
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    // Возобновить аудио контекст (для мобильных браузеров)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // Получить статус звука
    getSoundStatus() {
        return {
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled,
            masterVolume: this.masterVolume,
            soundVolume: this.soundVolume,
            musicVolume: this.musicVolume
        };
    }
}

// Создаем глобальный экземпляр менеджера звуков
window.soundManager = new SoundManager();

// Возобновляем аудио контекст при первом взаимодействии пользователя
document.addEventListener('click', () => {
    window.soundManager.resumeAudioContext();
}, { once: true });

document.addEventListener('touchstart', () => {
    window.soundManager.resumeAudioContext();
}, { once: true });

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}