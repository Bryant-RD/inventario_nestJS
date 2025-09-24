import * as nodeCrypto from 'crypto';

if (!(global as any).crypto) {
  (global as any).crypto = nodeCrypto;
}