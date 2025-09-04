// Clean dist and dist/filemaker folders after build
import fs from 'fs';
import path from 'path';

const dirs = [
  path.resolve('dist'),
  path.resolve('dist/filemaker')
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file !== 'index.html' && file !== 'bundle.js' && file !== 'styles.css') {
        const filePath = path.join(dir, file);
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`Removed: ${filePath}`);
      }
    });
  }
});
