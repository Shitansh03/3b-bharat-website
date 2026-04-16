import { useState, useEffect } from 'react';

/**
 * Custom hook to load videos using a background Web Worker.
 * @param {string[]} videoUrls - Array of video URLs to preload
 * @returns {Record<string, string>} A map of original URLs to locally generated ObjectURLs
 */
export const useVideoWorker = (videoUrls = []) => {
  const [blobUrls, setBlobUrls] = useState({});

  useEffect(() => {
    if (!videoUrls || videoUrls.length === 0) return;

    // Initialize the web worker using the Vite worker instance
    const worker = new Worker(new URL('../workers/videoWorker.js', import.meta.url), {
      type: 'module',
    });

    // Listen for messages from the worker
    worker.onmessage = (event) => {
      const { url, blob, error } = event.data;

      if (error) {
        console.error(`[Web Worker] Error loading video ${url}:`, error);
        return;
      }

      if (blob) {
        // Create an ObjectURL from the fetched blob
        const objectUrl = URL.createObjectURL(blob);
        setBlobUrls((prev) => ({
          ...prev,
          [url]: objectUrl,
        }));
      }
    };

    // Send URLs to the worker to fetch
    videoUrls.forEach((url, index) => {
      // Only request if we haven't already loaded it
      if (!blobUrls[url]) {
        worker.postMessage({ url, id: index });
      }
    });

    // Cleanup function when component unmounts
    return () => {
      // Terminate the worker
      worker.terminate();
      
      // Revoke any created Object URLs to avoid memory leaks
      Object.keys(blobUrls).forEach((url) => {
        // Find if this specific instance was revoked
        URL.revokeObjectURL(blobUrls[url]);
      });
    };
    // Note: We intentionally avoid adding `blobUrls` to the dependency array
    // so it doesn't cause a re-render loop when `setBlobUrls` is called.
  }, [JSON.stringify(videoUrls)]);

  return blobUrls;
};

export default useVideoWorker;
