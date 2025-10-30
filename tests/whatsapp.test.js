import { beforeAll, describe, test, expect } from '@jest/globals';

let isDirectMessage;

describe('WhatsApp helper functions', () => {
  beforeAll(async () => {
    const mod = await import('../src/whatsapp/index.js');
    isDirectMessage = mod.isDirectMessage;
  });

  test('returns true for direct message (not group, not fromMe)', () => {
    const msg = {
      fromMe: false,
      isGroupMsg: false,
      broadcast: false,
      isStatus: false,
      from: '1234567890@c.us',
    };
    expect(isDirectMessage(msg)).toBe(true);
  });

  test('returns false for group message or fromMe', () => {
    const groupMsg = {
      fromMe: false,
      isGroupMsg: true,
      broadcast: false,
      isStatus: false,
      from: '12345-67890@g.us',
    };
    const fromMeMsg = {
      fromMe: true,
      isGroupMsg: false,
      broadcast: false,
      isStatus: false,
      from: '1234567890@c.us',
    };
    expect(isDirectMessage(groupMsg)).toBe(false);
    expect(isDirectMessage(fromMeMsg)).toBe(false);
  });
});