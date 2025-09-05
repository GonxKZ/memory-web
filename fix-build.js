import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, extname } from 'path';

// Function to fix escaped quotes in a file
function fixEscapedQuotes(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    
    // Fix escaped double quotes
    content = content.replace(/\\"/g, '"');
    
    // Fix escaped single quotes
    content = content.replace(/\\'/g, "'");
    
    // Fix escaped backticks
    content = content.replace(/\\`/g, '`');
    
    writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed escaped quotes in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to fix syntax errors in a file
function fixSyntaxErrors(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    
    // Fix common syntax errors
    // Remove unnecessary escape characters
    content = content.replace(/\\n/g, '\n');
    content = content.replace(/\\t/g, '\t');
    
    // Fix incorrect JSX syntax
    content = content.replace(/className=\\"([^"]+)\\"/g, 'className="$1"');
    
    writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax errors in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Recursively find all .tsx files
function findTSXFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  
  list.forEach(file => {
    file = resolve(dir, file);
    const stat = statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findTSXFiles(file));
    } else if (extname(file) === '.tsx') {
      results.push(file);
    }
  });
  
  return results;
}

// Main function
function main() {
  const srcDir = resolve(process.cwd(), 'src');
  const tsxFiles = findTSXFiles(srcDir);
  
  console.log(`Found ${tsxFiles.length} .tsx files to fix`);
  
  tsxFiles.forEach(file => {
    fixEscapedQuotes(file);
    fixSyntaxErrors(file);
  });
  
  console.log('Finished fixing files');
}

main();