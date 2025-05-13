# Splash Screen Generator

This directory contains a tool to generate a splash screen for your app.

## How to use the splash generator

1. Open the `splash-generator.html` file in a web browser
2. Upload your logo image (preferably a PNG with transparent background)
3. Adjust settings as needed:
   - Background color
   - Logo size
   - Logo position
4. Click "Generate Splash Screen"
5. Download the generated image
6. Save the downloaded image as `splash.png` in the `assets/images` directory
7. The app is already configured in `app.json` to use this splash screen

## Requirements

- The final splash image should be 1024x1024px
- Your logo should be centered and properly sized
- Use a background color that matches your app's theme

Once you've saved the splash.png file in the correct location, your app will automatically use it as the splash screen during loading.

## Note about placeholder

There is currently a placeholder file in `assets/images/splash.png` that should be replaced with your actual splash screen image generated using this tool. 