# Splash Screen Setup

## Current Status
- Created a placeholder SVG file at `assets/images/splash.svg`
- Added instructions at `assets/images/splash.txt`
- The app.json is configured to use `./assets/images/splash.png` for the splash screen

## Steps to Complete
1. Use the custom splash generator tool at `assets/temp/splash-generator.html`:
   - Open this HTML file in any browser
   - Upload a logo image (preferably with transparency)
   - Adjust the background color and logo size
   - Click "Generate Splash Screen"
   - Download the generated PNG

2. Save the downloaded image as `splash.png` in the `assets/images` directory

3. Verify the splash screen works by running the app

## Alternative Method
If you prefer to create your own splash screen from scratch:
- Create a 1024x1024px PNG image
- Place it at `assets/images/splash.png`
- Ensure it matches the app's theme and branding

## Note
The SVG file (`assets/images/splash.svg`) is just a placeholder and cannot be used directly as the splash screen. You must convert it to PNG format or create a new PNG file as described above. 