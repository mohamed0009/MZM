const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 1024x1024 canvas for the icon (standard size for app icons)
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Fill background with the green color from the logo
ctx.fillStyle = '#00AA78'; // Pharmacy green
ctx.fillRect(0, 0, 1024, 1024);

// Logo background - white circle
ctx.beginPath();
ctx.arc(512, 512, 400, 0, Math.PI * 2); // Centered and larger for the icon
ctx.fillStyle = 'white';
ctx.fill();

// Add "Px" text inside the circle
ctx.font = 'bold 400px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#00AA78'; // Same green as background
ctx.fillText('Px', 512, 512);

// Save as PNG for the app icon
const buffer = canvas.toBuffer('image/png');
const logoPath = path.join(__dirname, 'assets', 'images', 'logo.png');
fs.writeFileSync(logoPath, buffer);

// Also save as icon.png since app.json references this
const iconPath = path.join(__dirname, 'assets', 'images', 'icon.png');
fs.writeFileSync(iconPath, buffer);

console.log(`Logo created at: ${logoPath}`);
console.log(`Icon created at: ${iconPath}`);
console.log('Logo and icon files now match the splash screen design'); 