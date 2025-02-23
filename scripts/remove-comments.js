// scripts/remove-comments.js
const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

function removeComments(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.')) {
      removeComments(filePath);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const strippedContent = strip(content);
      fs.writeFileSync(filePath, strippedContent);
    }
  });
}

removeComments('./app');
removeComments('./components');
removeComments('./lib');
