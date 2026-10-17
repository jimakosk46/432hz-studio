(function (root) {
  'use strict';

  function createAudioCaptureManager(mediaDevices) {
    let activeOwner = null, pendingOwner = null, stream = null, generation = 0;
    return {
      async acquire(owner, constraints) {
        if (activeOwner || pendingOwner) {
          const error = new Error('microphone-in-use');
          error.name = 'NotReadableError';
          throw error;
        }
        const token = ++generation;
        pendingOwner = owner;
        try {
          const acquired = await mediaDevices.getUserMedia(constraints);
          if (token !== generation) {
            acquired.getTracks().forEach(track => track.stop());
            const error = new Error('microphone-request-cancelled');
            error.name = 'AbortError';
            throw error;
          }
          pendingOwner = null;
          activeOwner = owner;
          stream = acquired;
          return acquired;
        } catch (error) {
          if (token === generation) pendingOwner = null;
          throw error;
        }
      },
      release(owner) {
        if (pendingOwner === owner) { generation++; pendingOwner = null; }
        if (activeOwner !== owner) return false;
        const current = stream;
        activeOwner = null;
        stream = null;
        current.getTracks().forEach(track => track.stop());
        return true;
      },
      owner() { return activeOwner || pendingOwner; },
    };
  }

  const api = { createAudioCaptureManager };
  if (root.navigator && root.navigator.mediaDevices) api.manager = createAudioCaptureManager(root.navigator.mediaDevices);
  root.AudioCapture = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
