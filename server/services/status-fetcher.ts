import configuration from './configuration';
import StatusFetcher from './StatusFetcher';

const statusFetcher = new StatusFetcher(
  configuration.statusUrlTemplate,
  configuration.fetchInterval,
  configuration.minimalFetchInterval,
);

export default statusFetcher;
