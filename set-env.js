const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configure the path to your environment file
// We will generate the file inside src/environments
const envDirectory = path.join(__dirname, 'src', 'environments');
const targetPath = path.join(envDirectory, 'environment.ts');

// Ensure the environments directory exists
if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory, { recursive: true });
}

const envConfigFile = `export const environment = {
  production: false,
  firebaseUrl: '${process.env.FIREBASE_URL}',
  firebaseApiKey: '${process.env.FIREBASE_API_KEY}'
};
`;
// const envConfigFile = `export const environment = {
//   production: true,
//   firebaseUrl: '${process.env.FIREBASE_URL}',
//   firebaseApiKey: '${process.env.FIREBASE_API_KEY}'
// };
// `;

// Write the file
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});