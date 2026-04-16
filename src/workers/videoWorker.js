// src/workers/videoWorker.js
self.onmessage = async (e) => {
  const { url, id } = e.data;

  try {
    // Fetch the video file as a blob
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    const blob = await response.blob();
    
    // Post the successful blob back to the main thread
    self.postMessage({ id, url, blob, error: null });
  } catch (error) {
    // Post the error back to the main thread
    self.postMessage({ id, url, blob: null, error: error.message });
  }
};
