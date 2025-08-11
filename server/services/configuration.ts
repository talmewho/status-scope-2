function getNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value) {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) {
      console.log(`The ${key} environmental variable value is not a number. Instead, got ${value}`);
      return numericValue;
    }
  }
  return defaultValue;
}

const statusUrlTemplate = process.env.STATUS_URL_TEMPLATE;

if (!statusUrlTemplate) {
  throw new Error('The STATUS_URL_TEMPLATE environmental variable is not defined');
}

export default {
  statusUrlTemplate,
  minimalFetchInterval: getNumber('MINIMAL_FETCH_INTERVAL', 1000 * 60),
  fetchInterval: getNumber('FETCH_INTERVAL', 1000 * 60 * 5),
};
