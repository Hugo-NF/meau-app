// File operations module.

const FileOperations = {
  fileExtension(fileName: string): (string | null) {
    const splitted = fileName.split('.');
    if (splitted.length < 2) return null;
    return splitted[splitted.length - 1];
  },
};

export default FileOperations;
