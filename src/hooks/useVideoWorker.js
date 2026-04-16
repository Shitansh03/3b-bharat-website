import { useState, useEffect } from 'react';

/**
 * Checks whether a URL is cross-origin relative to the current page.
 * Cross-origin URLs cannot be fetched via fetch() in a Web Worker due to CORS.
 * The browser's native <video> element handles cross-origin playback fine on its own.
 */
const isCrossOrigin = (url) => {
  try {
    // Relative URLs (e.g. "/video/foo.mp4") are always same-origin
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    const urlOrigin = new URL(url).origin;
    return urlOrigin !== window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Custom hook to load videos using a background Web Worker.
 * Cross-origin URLs are passed through unchanged so the <video> tag handles them directly.
 * @param {string[]} videoUrls - Array of video URLs to preload
 * @returns {Record<string, string>} A map of original URLs to blob ObjectURLs (or the original URL for cross-origin)
 */
export const useVideoWorker = (videoUrls = []) => {
  const [blobUrls, setBlobUrls] = useState({});

  useEffect(() => {
    if (!videoUrls || videoUrls.length === 0) return;

    // Separate cross-origin URLs (pass-through) from same-origin URLs (worker fetch)
    const crossOriginUrls = videoUrls.filter(isCrossOrigin);
    const sameOriginUrls = videoUrls.filter((url) => !isCrossOrigin(url));

    // Immediately resolve cross-origin URLs by mapping them to themselves
    if (crossOriginUrls.length > 0) {
      setBlobUrls((prev) => {
        const updates = {};
        crossOriginUrls.forEach((url) => {
          if (!prev[url]) updates[url] = url; // use the URL directly
        });
        return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
      });
    }

    // Skip creating a worker if there are no same-origin URLs to fetch
    if (sameOriginUrls.length === 0) return;

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

    // Send only same-origin URLs to the worker to fetch
    sameOriginUrls.forEach((url, index) => {
      if (!blobUrls[url]) {
        worker.postMessage({ url, id: index });
      }
    });

    // Cleanup function when component unmounts
    return () => {
      // Terminate the worker
      worker.terminate();

      // Revoke any created Object URLs to avoid memory leaks (skip pass-through URLs)
      Object.entries(blobUrls).forEach(([originalUrl, blobUrl]) => {
        if (blobUrl !== originalUrl) {
          URL.revokeObjectURL(blobUrl);
        }
      });
    };
    // Note: We intentionally avoid adding `blobUrls` to the dependency array
    // so it doesn't cause a re-render loop when `setBlobUrls` is called.
  }, [JSON.stringify(videoUrls)]);

  return blobUrls;
};

export default useVideoWorker;
