export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>): Promise<ReturnType<T>> =>
    new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
) => {
  let lastTime = 0;

  return (...args: Parameters<T>): Promise<ReturnType<T>> =>
    new Promise((resolve) => {
      const now = Date.now();

      if (now - lastTime >= waitFor) {
        lastTime = now;
        resolve(func(...args));
      }
    });
};
