#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const fs = require('fs');

// Apple Sign-In JWT Generator
// Führen Sie dieses Script aus: node generate-apple-jwt.js

const TEAM_ID = 'YOUR_TEAM_ID'; // Ersetzen Sie mit Ihrer Team ID
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Ersetzen Sie mit Ihrer Service ID
const KEY_ID = 'YOUR_KEY_ID'; // Ersetzen Sie mit Ihrer Key ID
const PRIVATE_KEY_PATH = './AuthKey_YOUR_KEY_ID.p8'; // Pfad zu Ihrer .p8 Datei

function generateAppleJWT() {
  try {
    // Lese Private Key
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    
    // Erstelle JWT Header
    const header = {
      alg: 'RS256',
      kid: KEY_ID,
      typ: 'JWT'
    };
    
    // Erstelle JWT Payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: TEAM_ID,
      iat: now,
      exp: now + (6 * 30 * 24 * 60 * 60), // 6 Monate
      aud: 'https://appleid.apple.com',
      sub: SERVICE_ID
    };
    
    // Erstelle JWT
    const token = jwt.sign(payload, privateKey, { 
      algorithm: 'RS256',
      header: header
    });
    
    console.log('🍎 Apple Sign-In JWT generiert:');
    console.log('='.repeat(50));
    console.log(token);
    console.log('='.repeat(50));
    console.log('\n📋 Kopieren Sie diesen JWT in Supabase:');
    console.log('1. Gehen Sie zu: Supabase Dashboard → Authentication → Providers → Apple');
    console.log('2. Fügen Sie den JWT in das "Secret" Feld ein');
    console.log('3. Speichern Sie die Konfiguration');
    
  } catch (error) {
    console.error('❌ Fehler beim Generieren des JWT:', error.message);
    console.log('\n🔧 Stellen Sie sicher, dass:');
    console.log('- TEAM_ID korrekt ist');
    console.log('- SERVICE_ID korrekt ist');
    console.log('- KEY_ID korrekt ist');
    console.log('- Private Key Datei existiert');
  }
}

// Prüfe ob alle Variablen gesetzt sind
if (TEAM_ID === 'YOUR_TEAM_ID' || SERVICE_ID === 'YOUR_SERVICE_ID' || KEY_ID === 'YOUR_KEY_ID') {
  console.log('❌ Bitte aktualisieren Sie die Variablen im Script:');
  console.log('- TEAM_ID: Ihre Apple Team ID');
  console.log('- SERVICE_ID: Ihre Apple Service ID');
  console.log('- KEY_ID: Ihre Apple Key ID');
  console.log('- PRIVATE_KEY_PATH: Pfad zu Ihrer .p8 Datei');
} else {
  generateAppleJWT();
}
