import type { Request, Response } from 'express';
import { sendOk } from '../../common/http/apiResponse';
import { getHealthStatus } from './health.service';

export function getHealthController(_req: Request, res: Response): void {
  const data = getHealthStatus();
  sendOk(res, data);
}
