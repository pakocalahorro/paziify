import 'react-native-url-polyfill/auto';

// 1. Blindaje Resiliente de FormData
try {
  if (typeof global.FormData === 'undefined') {
    const RNFormData = require('react-native/Libraries/Network/FormData');
    global.FormData = RNFormData.default ?? RNFormData;
  }
} catch (e) {
  // FormData no disponible en esta ruta interna
}

// 2. Blindaje Resiliente de APIs de Red (Headers, Request, Response, fetch)
try {
  const fetchModule = require('react-native/Libraries/Network/fetch');
  if (typeof global.Headers === 'undefined') global.Headers = fetchModule.Headers;
  if (typeof global.Request === 'undefined') global.Request = fetchModule.Request;
  if (typeof global.Response === 'undefined') global.Response = fetchModule.Response;
  if (typeof global.fetch === 'undefined') global.fetch = fetchModule.fetch;
} catch (e) {
  // fetch module no disponible en esta ruta interna
}

// 3. queueMicrotask
if (typeof global.queueMicrotask === 'undefined') {
  global.queueMicrotask = (callback: any) => Promise.resolve().then(callback);
}

// 4. structuredClone
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

// 5. AbortController
if (typeof global.AbortController === 'undefined') {
  try {
    const { AbortController } = require('react-native/Libraries/Network/AbortController');
    global.AbortController = AbortController;
  } catch (e) {}
}

// 6. TextEncoder / TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  try {
    const { TextEncoder, TextDecoder } = require('react-native/Libraries/Blob/FileReader');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  } catch (e) {}
}

// 7. Blob
if (typeof global.Blob === 'undefined') {
  try {
    global.Blob = require('react-native/Libraries/Blob/Blob').default;
  } catch (e) {}
}

// 8. FileReader
if (typeof global.FileReader === 'undefined') {
  try {
    global.FileReader = require('react-native/Libraries/Blob/FileReader').default;
  } catch (e) {}
}
