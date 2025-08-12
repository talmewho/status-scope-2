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

type TFetchedStatusData = {
  didFetch: boolean;
  data?: TStatusData;
};

class StatusFetcher {
  private subscribers: ((data: TAllStatusData) => void)[] = [];

  private statusFetcherSchedulerId: ReturnType<typeof setInterval> | undefined;

  private readonly apiUrlTemplate: string;

  private readonly fetchInterval: number;
  private readonly minimalFetchInterval: number;

  private statusData: TAllStatusData = {};
  private lastFetchErrors: Partial<Record<ERegion, number>> = {};

  constructor(urlTemplate: string, fetchInterval: number, minimalFetchInterval: number) {
    this.apiUrlTemplate = urlTemplate;
    this.fetchInterval = fetchInterval;
    this.minimalFetchInterval = minimalFetchInterval;
  }

  private sendToAllSubscribers(data: TAllStatusData) {
    this.subscribers.forEach(callback => callback(data));
  }

  private periodicallyRefetchStatus() {
    if (!this.subscribers.length || this.statusFetcherSchedulerId) {
      return;
    }

    this.statusFetcherSchedulerId = setInterval(async () => {
      this.sendToAllSubscribers(await this.refreshAllStatuses());
    }, this.fetchInterval);
  }

  private getUrl(region: ERegion): string {
    return this.apiUrlTemplate.replace('{region}', region);
  }

  private async fetchStatus(region: ERegion): Promise<TStatusData> {
    try {
      const response = await fetch(this.getUrl(region));
      if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status} for region ${region}`);
      }
      return await response.json();
    }
    catch (error) {
      console.error('Error fetching status', error, region);
      throw error;
    }
  }

  private async tryFetchStatus(
    region: ERegion,
    lastUpdated?: number,
    lastErrored?: number,
  ): Promise<TFetchedStatusData> {
    if (lastUpdated && ((Date.now() - lastUpdated) < this.minimalFetchInterval)) {
      return {
        didFetch: false,
      };
    }

    const timeSinceLastError = lastErrored ? Date.now() - lastErrored : 0;
    if (timeSinceLastError && (timeSinceLastError < this.minimalFetchInterval)) {
      return {
        didFetch: false,
      };
    }

    return {
      didFetch: true,
      data: await this.fetchStatus(region),
    };
  }

  private async refreshAllStatuses(): Promise<TAllStatusData> {
    const potentialFetchPromises = regions.map(region => (
      this.tryFetchStatus(region, this.statusData[region]?.lastUpdated, this.lastFetchErrors[region])
    ));

    const results = await Promise.allSettled(potentialFetchPromises);
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { didFetch, data } = result.value;
        if (didFetch && data) {
          this.statusData[regions[index]] = { data, lastUpdated: Date.now() };
        }
      }
      else {
        this.lastFetchErrors[regions[index]] = Date.now();
      }
    });
    return this.statusData;
  }

  private terminate(): void {
    this.statusData = {};
    clearInterval(this.statusFetcherSchedulerId);
    this.statusFetcherSchedulerId = undefined;
  }

  public async subscribe(callback: (data: TAllStatusData) => void) {
    this.subscribers.push(callback);
    callback(await this.refreshAllStatuses());
    this.periodicallyRefetchStatus();
  }

  public unsubscribe(callback: (data: TAllStatusData) => void) {
    const subscriberIndex = this.subscribers.indexOf(callback);
    if (subscriberIndex === -1) {
      return;
    }

    this.subscribers.splice(subscriberIndex, 1);

    if (this.subscribers.length === 0) {
      this.terminate();
    }
  }
}

export default StatusFetcher;
