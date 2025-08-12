import { EventEmitter } from 'node:events';
import { ERegion } from 'common/regions';
import type { TAllStatusData, TStatusData } from 'common/backend.types';

const regions: ERegion[] = [
  ERegion.UsEast,
  ERegion.EuWest,
  ERegion.EuCentral,
  ERegion.UsWest,
  ERegion.SaEast,
  ERegion.ApSoutheast,
];

export class StatusFetcher extends EventEmitter {
  private statusFetcherSchedulerId: ReturnType<typeof setInterval>;

  private readonly apiUrlTemplate: string;

  private readonly fetchInterval: number;

  private statusData: TAllStatusData = {};

  constructor(urlTemplate: string, fetchInterval: number) {
    super();
    this.apiUrlTemplate = urlTemplate;
    this.fetchInterval = fetchInterval;

    this.statusFetcherSchedulerId = setInterval(async () => {
      this.emit('data', await this.fetchAllStatuses());
    }, this.fetchInterval);
  }

  private getUrl(region: ERegion): string {
    return this.apiUrlTemplate.replace('{region}', region);
  }

  private async fetchStatus(region: ERegion): Promise<TStatusData> {
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

  async fetchAllStatuses(): Promise<TAllStatusData> {
    const promises = regions.map(region => this.fetchStatus(region));
    const results = await Promise.allSettled(promises);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const status = result.value;
        this.statusData[regions[index]] = { data: status, lastUpdated: Date.now() };
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
