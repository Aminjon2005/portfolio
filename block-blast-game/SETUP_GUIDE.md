# Block Blast - Подробное руководство по установке / Setup Guide

## 🇷🇺 Русский

### Шаг 1: Установка необходимого ПО

1. **Установите Node.js**
   - Скачайте с https://nodejs.org/
   - Рекомендуется версия 14 или выше
   - Проверьте установку: `node --version`

2. **Установите Cordova**
   ```bash
   npm install -g cordova
   ```
   
3. **Для Android:**
   - Установите Android Studio: https://developer.android.com/studio
   - Установите Android SDK
   - Настройте переменные окружения (ANDROID_HOME)

4. **Для iOS (только macOS):**
   - Установите Xcode из App Store
   - Установите Xcode Command Line Tools
   - Установите CocoaPods: `sudo gem install cocoapods`

### Шаг 2: Настройка проекта

1. **Инициализируйте проект**
   ```bash
   cd block-blast-game
   npm install
   ```

2. **Зарегистрируйтесь в Appodeal**
   - Перейдите на https://www.appodeal.com/
   - Создайте аккаунт
   - Создайте новое приложение
   - Получите App Key для Android и iOS

3. **Обновите ключи Appodeal**
   
   Откройте `www/js/appodeal.js` и замените:
   ```javascript
   APP_KEY_ANDROID: 'YOUR_ANDROID_APP_KEY_HERE',
   APP_KEY_IOS: 'YOUR_IOS_APP_KEY_HERE',
   ```
   
   на ваши реальные ключи:
   ```javascript
   APP_KEY_ANDROID: 'ваш_реальный_android_ключ',
   APP_KEY_IOS: 'ваш_реальный_ios_ключ',
   ```

### Шаг 3: Добавление платформ и плагинов

1. **Добавьте платформы**
   ```bash
   cordova platform add android
   cordova platform add ios  # только для macOS
   ```

2. **Установите плагин Appodeal**
   ```bash
   cordova plugin add https://github.com/appodeal/appodeal-cordova-plugin.git
   ```

3. **Проверьте установленные плагины**
   ```bash
   cordova plugin ls
   ```

### Шаг 4: Сборка и запуск

**Для тестирования в браузере:**
```bash
# Просто откройте www/index.html в браузере
# или
cordova run browser
```

**Для Android:**
```bash
# Сборка
cordova build android

# Запуск на подключенном устройстве
cordova run android

# Создание APK для релиза
cordova build android --release
```

**Для iOS:**
```bash
# Сборка
cordova build ios

# Запуск на подключенном устройстве
cordova run ios

# Откройте в Xcode для дальнейшей настройки
open platforms/ios/*.xcworkspace
```

### Шаг 5: Тестирование рекламы

1. **Режим тестирования**
   - По умолчанию включен режим тестирования
   - В `www/js/appodeal.js` установлено `TESTING: true`
   - Вы будете видеть тестовую рекламу

2. **Перед публикацией**
   - Установите `TESTING: false` в `appodeal.js`
   - Пересоберите приложение
   - Протестируйте на реальном устройстве

### Шаг 6: Публикация

**Google Play (Android):**
1. Создайте signing key:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Создайте файл `build.json` в корне проекта:
   ```json
   {
     "android": {
       "release": {
         "keystore": "my-release-key.keystore",
         "storePassword": "ваш_пароль",
         "alias": "alias_name",
         "password": "ваш_пароль"
       }
     }
   }
   ```

3. Соберите подписанный APK:
   ```bash
   cordova build android --release
   ```

4. Загрузите APK в Google Play Console

**App Store (iOS):**
1. Откройте проект в Xcode
2. Настройте Bundle Identifier и Provisioning Profile
3. Archive and Upload через Xcode

### Устранение типичных проблем

**Проблема:** Appodeal не инициализируется
- **Решение:** Проверьте правильность App Keys, убедитесь что плагин установлен

**Проблема:** Gradle ошибки при сборке Android
- **Решение:** Обновите Android SDK, проверьте версии в `config.xml`

**Проблема:** CocoaPods ошибки при сборке iOS
- **Решение:** `pod repo update`, `cd platforms/ios && pod install`

**Проблема:** Реклама не показывается на устройстве
- **Решение:** Проверьте интернет-соединение, дождитесь загрузки рекламы (может занять время)

---

## 🇬🇧 English

### Step 1: Install Required Software

1. **Install Node.js**
   - Download from https://nodejs.org/
   - Version 14 or higher recommended
   - Verify: `node --version`

2. **Install Cordova**
   ```bash
   npm install -g cordova
   ```
   
3. **For Android:**
   - Install Android Studio: https://developer.android.com/studio
   - Install Android SDK
   - Setup environment variables (ANDROID_HOME)

4. **For iOS (macOS only):**
   - Install Xcode from App Store
   - Install Xcode Command Line Tools
   - Install CocoaPods: `sudo gem install cocoapods`

### Step 2: Project Setup

1. **Initialize Project**
   ```bash
   cd block-blast-game
   npm install
   ```

2. **Register with Appodeal**
   - Go to https://www.appodeal.com/
   - Create account
   - Create new app
   - Get App Keys for Android and iOS

3. **Update Appodeal Keys**
   
   Open `www/js/appodeal.js` and replace:
   ```javascript
   APP_KEY_ANDROID: 'YOUR_ANDROID_APP_KEY_HERE',
   APP_KEY_IOS: 'YOUR_IOS_APP_KEY_HERE',
   ```
   
   with your actual keys:
   ```javascript
   APP_KEY_ANDROID: 'your_actual_android_key',
   APP_KEY_IOS: 'your_actual_ios_key',
   ```

### Step 3: Add Platforms and Plugins

1. **Add Platforms**
   ```bash
   cordova platform add android
   cordova platform add ios  # macOS only
   ```

2. **Install Appodeal Plugin**
   ```bash
   cordova plugin add https://github.com/appodeal/appodeal-cordova-plugin.git
   ```

3. **Verify Installed Plugins**
   ```bash
   cordova plugin ls
   ```

### Step 4: Build and Run

**For browser testing:**
```bash
# Simply open www/index.html in browser
# or
cordova run browser
```

**For Android:**
```bash
# Build
cordova build android

# Run on connected device
cordova run android

# Create release APK
cordova build android --release
```

**For iOS:**
```bash
# Build
cordova build ios

# Run on connected device
cordova run ios

# Open in Xcode for further configuration
open platforms/ios/*.xcworkspace
```

### Step 5: Testing Ads

1. **Test Mode**
   - Test mode is enabled by default
   - In `www/js/appodeal.js`, `TESTING: true` is set
   - You'll see test ads

2. **Before Publishing**
   - Set `TESTING: false` in `appodeal.js`
   - Rebuild the app
   - Test on real device

### Step 6: Publishing

**Google Play (Android):**
1. Create signing key:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Create `build.json` in project root:
   ```json
   {
     "android": {
       "release": {
         "keystore": "my-release-key.keystore",
         "storePassword": "your_password",
         "alias": "alias_name",
         "password": "your_password"
       }
     }
   }
   ```

3. Build signed APK:
   ```bash
   cordova build android --release
   ```

4. Upload APK to Google Play Console

**App Store (iOS):**
1. Open project in Xcode
2. Configure Bundle Identifier and Provisioning Profile
3. Archive and Upload through Xcode

### Common Issues

**Issue:** Appodeal not initializing
- **Solution:** Check App Keys are correct, ensure plugin is installed

**Issue:** Gradle errors when building Android
- **Solution:** Update Android SDK, check versions in `config.xml`

**Issue:** CocoaPods errors when building iOS
- **Solution:** `pod repo update`, `cd platforms/ios && pod install`

**Issue:** Ads not showing on device
- **Solution:** Check internet connection, wait for ads to load (may take time)
