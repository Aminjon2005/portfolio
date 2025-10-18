# Block Blast Game with Appodeal Integration

A mobile puzzle game similar to Block Blast, built with HTML5, CSS3, and JavaScript, integrated with Appodeal for monetization.

## 🎮 Game Features

- **Classic Block Puzzle Gameplay**: Place blocks on an 8x8 grid
- **Line Clearing**: Clear full rows and columns to score points
- **Multiple Block Shapes**: 30+ different block shapes
- **Score System**: Track your current and best scores
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Mobile-Ready**: Optimized for touch controls on mobile devices
- **Appodeal Integration**: Monetize with interstitial, banner, and rewarded video ads

## 📱 Ad Integration

The game includes Appodeal SDK integration with:
- **Banner Ads**: Displayed at the bottom of the screen
- **Interstitial Ads**: Shown after completing a set of blocks or on game over
- **Rewarded Video Ads**: (Optional) Can be used to grant bonus points or extra moves

## 🚀 Quick Start

### For Web Testing (Browser)

1. Open `www/index.html` in a web browser
2. The game will work without Appodeal in browser mode
3. Use mouse drag and drop to place blocks

### For Mobile Deployment

#### Prerequisites

- Node.js (v14 or higher)
- Cordova CLI: `npm install -g cordova`
- Android SDK (for Android builds)
- Xcode (for iOS builds, macOS only)

#### Setup Steps

1. **Install dependencies**
   ```bash
   cd block-blast-game
   npm install
   ```

2. **Configure Appodeal**
   - Sign up at [Appodeal](https://www.appodeal.com/)
   - Create an app and get your App Keys
   - Update `www/js/appodeal.js`:
     ```javascript
     APP_KEY_ANDROID: 'your_android_app_key',
     APP_KEY_IOS: 'your_ios_app_key',
     ```

3. **Add Appodeal Plugin**
   ```bash
   cordova plugin add https://github.com/appodeal/appodeal-cordova-plugin.git
   ```

4. **Add Platforms**
   ```bash
   cordova platform add android
   cordova platform add ios
   ```

5. **Build and Run**
   
   For Android:
   ```bash
   cordova run android
   ```
   
   For iOS:
   ```bash
   cordova run ios
   ```

## 🎯 How to Play

1. **Drag blocks** from the bottom panel onto the 8x8 grid
2. **Place blocks** strategically to fill rows or columns
3. **Clear lines** by completely filling a row or column
4. **Score points** for placing blocks and clearing lines
5. **Game over** when you can't place any of the available blocks

## 📂 Project Structure

```
block-blast-game/
├── www/
│   ├── index.html          # Main game HTML
│   ├── css/
│   │   └── styles.css      # Game styling
│   ├── js/
│   │   ├── blocks.js       # Block shapes and definitions
│   │   ├── game.js         # Core game logic
│   │   ├── main.js         # Game controller and UI
│   │   └── appodeal.js     # Appodeal integration
│   └── img/                # Game images and icons
├── config.xml              # Cordova configuration
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## 🔧 Configuration

### Orientation
Default: Portrait (can be changed in `config.xml`)

### Minimum SDK Versions
- Android: API 21 (Android 5.0)
- iOS: 11.0

### Ad Settings
Configure ad behavior in `www/js/appodeal.js`:
- Set `TESTING: true` for test ads during development
- Set `TESTING: false` for production

## 📝 Customization

### Change Grid Size
Edit `game.js`:
```javascript
gameBoard = new GameBoard(8); // Change 8 to desired size
```

### Add More Block Shapes
Edit `blocks.js` and add new shapes to `BLOCK_SHAPES` array

### Modify Colors
Edit `blocks.js` to change block colors in `BLOCK_COLORS` array

### Adjust Ad Frequency
Edit `main.js` to control when ads are shown

## 🐛 Troubleshooting

### Appodeal not loading
- Make sure you've installed the plugin correctly
- Check that your App Keys are correct
- Verify network connectivity
- Check console for error messages

### Build errors
- Ensure all prerequisites are installed
- Run `cordova clean` and rebuild
- Check platform versions: `cordova platform ls`

### Cordova.js not found (web testing)
- This is normal when testing in browser
- The game will work without Cordova features
- Deploy to a device for full functionality

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy the game!** 🎉
