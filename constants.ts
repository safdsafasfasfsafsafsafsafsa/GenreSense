
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_DURATION_SECONDS = 600; // 10 minutes
export const MAX_ANALYSES_PER_DAY = 20;

export const ACCEPTED_FILE_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-m4a': ['.m4a'],
  'audio/aac': ['.aac'],
  'audio/flac': ['.flac'],
};
