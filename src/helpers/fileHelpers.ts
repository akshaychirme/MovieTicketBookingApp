import fs from 'fs';

// Function to read data from a file
export function readData<T>(filePath: string): T {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Function to write data to a file
export function writeData(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}