import { isIP } from 'node:net';

export interface Config {
  host: string;
  port: number;
}

export function readConfig(environment: Readonly<NodeJS.ProcessEnv>): Config {
  const host = environment.HOST ?? '127.0.0.1';
  const portText = environment.PORT ?? '3000';
  const port = Number(portText);

  if (!/^\d+$/.test(portText) || !Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  const hostname = /^(?=.{1,253}$)[a-z\d](?:[a-z\d.-]*[a-z\d])?$/i;
  if (isIP(host) === 0 && !hostname.test(host)) {
    throw new Error('HOST must be an IP address or hostname.');
  }

  return { host, port };
}
