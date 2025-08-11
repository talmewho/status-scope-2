import { EventEmitter } from 'node:events';
import { ERegion } from '../../common/regions';

const regions: ERegion[] = [
  ERegion.UsEast,
  ERegion.EuWest,
  ERegion.EuCentral,
  ERegion.UsWest,
  ERegion.SaEast,
  ERegion.ApSoutheast,
];

type TStatus = {
  region: ERegion
  status: string
  lastUpdated: string
};

// const minimalFetchInterval = process.env.MINIMAL_FETCH_INTERVAL ?? 1000 * 60;
const fetchInterval = process.env.FETCH_INTERVAL
  ? parseInt(process.env.FETCH_INTERVAL, 10)
  : 1000 * 60 * 5;

export class StatusFetcher extends EventEmitter {
  private statusFetcherSchedulerId: ReturnType<typeof setInterval>;

  private apiUrlTemplate: string = '';

  private statusData: Partial<Record<ERegion, TStatus>> = {};

  constructor(urlTemplate: string) {
    super();
    this.apiUrlTemplate = urlTemplate;

    this.statusFetcherSchedulerId = setInterval(async () => {
      this.emit('data', await this.fetchAllStatuses());
    }, fetchInterval);
  }

  private getUrl(region: ERegion): string {
    return this.apiUrlTemplate.replace('{region}', region);
  }

  private async fetchStatus(region: ERegion): Promise<TStatus> {
    try {
      const response = await fetch(this.getUrl(region));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
    catch (error) {
      console.error('Error fetching status:', error);
      throw error;
    }
  }

  async fetchAllStatuses(): Promise<Partial<Record<ERegion, TStatus>>> {
    const promises = regions.map(region => this.fetchStatus(region));
    const results = await Promise.allSettled(promises);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const status = result.value;
        this.statusData[regions[index]] = status;
      }
      else {
        console.error(`Failed to fetch status for ${regions[index]}:`, result.reason);
      }
    });
    return this.statusData;
  }

  terminate(): void {
    this.statusData = {};
    clearInterval(this.statusFetcherSchedulerId);
  }
}
