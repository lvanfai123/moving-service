// JWT Secret 生成器
// 用於生成安全的 JWT 密鑰

const crypto = require('crypto');

// 生成 64 字節的隨機密鑰
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

console.log('🔐 JWT Secret 生成器');
console.log('====================');
console.log('');
console.log('生成的 JWT_SECRET:');
console.log(generateJWTSecret());
console.log('');
console.log('將此密鑰複製到你的環境變數中！');
console.log('注意：請妥善保管此密鑰，不要分享給他人。'); 