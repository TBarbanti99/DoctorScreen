import { promises as fs } from 'fs';

export const unlinkFile = async (filePath: string) => {
    try {
        await fs.unlink(filePath);
        console.log(`File deleted successfully: ${filePath}`);
    } catch (err) {
        console.error(`Error deleting file: ${err}`);
    }
};