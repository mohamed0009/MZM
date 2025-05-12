const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 1024x1024 canvas
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Fill background with the green color from the logo
ctx.fillStyle = '#00AA78'; // Pharmacy green
ctx.fillRect(0, 0, 1024, 1024);

// Logo background - white circle
ctx.beginPath();
ctx.arc(512, 350, 120, 0, Math.PI * 2);
ctx.fillStyle = 'white';
ctx.fill();

// Add "Px" text inside the circle
ctx.font = 'bold 120px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = '#00AA78'; // Same green as background
ctx.fillText('Px', 512, 350);

// App name
ctx.font = 'bold 100px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
ctx.fillStyle = 'white';
ctx.fillText('PharmaFlow', 512, 550);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
const outputPath = path.join(__dirname, 'assets', 'images', 'splash.png');
fs.writeFileSync(outputPath, buffer);

console.log(`Green Px logo splash screen created at: ${outputPath}`);
console.log('The splash screen now matches the provided brand design'); 