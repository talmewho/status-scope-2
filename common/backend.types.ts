
type TRecentlyBlockedKey = [string, number, string];
type TTopKey = [string, number];

export type TWorkerDetails = {
  wait_time: number;
  workers: number;
  waiting: number;
  idle: number;
  time_to_return: number;
  recently_blocked_keys: TRecentlyBlockedKey[];
  top_keys: TTopKey[];
};

type TWorkerData = [string, TWorkerDetails];

type TServerStats = {
  cpus: number;
  active_connections: number;
  wait_time: number;
  workers: TWorkerData[];
  cpu_load: number;
  timers: number;
};

export type TStats = {
  servers_count: number;
  online: number;
  session: number;
  server: TServerStats;
};

export type TServices = Record<string, string>;

type TResults = {
  services: TServices;
  stats: TStats;
};

export type TStatusData = {
  status: string;
  region: string;
  roles: string[];
  results: TResults;
  strict: boolean;
  server_issue: null | Record<string, unknown>;
  version: string;
};
