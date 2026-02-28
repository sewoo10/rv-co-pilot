class MockEventEmitter {
  addListener = () => ({ remove: () => {} });
  removeListener = () => {};
  removeAllListeners = () => {};
  emit = () => {};
}

export const Platform = {
  OS: 'ios',
  select: (options: any) => options.ios || options.default,
};

export const NativeModules = {
  EventEmitter: MockEventEmitter,
};

export const NativeEventEmitter = MockEventEmitter;

export default {
  Platform,
  NativeModules,
  NativeEventEmitter,
};
