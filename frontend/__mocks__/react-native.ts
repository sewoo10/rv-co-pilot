export const Platform = {
  OS: 'ios',
  select: (options: any) => options.ios || options.default,
};

export default {
  Platform,
};
