export const chunkText = (text: string, maxChunkSize: number = 1000): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += sentence + ' ';
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

export const extractMetadata = (text: string) => {
  const firstLine = text.split('\n')[0];
  const wordCount = text.split(/\s+/).length;
  const estimatedReadingTime = Math.ceil(wordCount / 200);

  return {
    title: firstLine,
    wordCount,
    estimatedReadingTime,
    processedAt: new Date().toISOString(),
  };
};