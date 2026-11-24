import type { HealthResponseDto } from '@multicam/shared';

export function getHealthStatus(): HealthResponseDto {
  return {
    server_time: new Date().toISOString(),
    name: 'multicam-server',
    version: '1.0.0',
  };
}
