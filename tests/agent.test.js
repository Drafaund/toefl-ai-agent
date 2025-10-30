import { beforeEach, describe, test, expect, jest } from '@jest/globals';

let runAgent;
let setClient;
let resetConversation;

describe('TOEFL AI Agent - unit tests', () => {
  beforeEach(async () => {
    const mod = await import('../src/agent/index.js');
    runAgent = mod.runAgent;
    setClient = mod.setClient;
    resetConversation = mod.resetConversation;
    resetConversation();
  });

  test('returns assistant reply when client provides content', async () => {
    const mockClient = {
      chat: {
        completions: {
          create: jest.fn(async () => ({ choices: [{ message: { content: 'Assistant reply' } }] })),
        },
      },
    };
    setClient(mockClient);
    const res = await runAgent('Hello');
    expect(res).toBe('Assistant reply');
  });

  test('returns fallback when no choices provided', async () => {
    const mockClient = {
      chat: {
        completions: {
          create: jest.fn(async () => ({ choices: [] })),
        },
      },
    };
    setClient(mockClient);
    const res = await runAgent('Hello again');
    expect(res).toBe('Maaf, tidak ada respons.');
  });

  test('sends user message in messages to create()', async () => {
    const calls = [];
    const mockClient = {
      chat: {
        completions: {
          create: jest.fn(async (opts) => {
            calls.push(opts.messages);
            return { choices: [{ message: { content: 'ok' } }] };
          }),
        },
      },
    };
    setClient(mockClient);
    await runAgent('What is the answer?');
    expect(calls.length).toBe(1);
    const messagesSent = calls[0];
    const userMsg = messagesSent.find((m) => m.role === 'user');
    expect(userMsg).toBeDefined();
    expect(userMsg.content).toBe('What is the answer?');
  });

  test('conversation history persists across calls', async () => {
    const calls = [];
    let callIdx = 0;
    const mockClient = {
      chat: {
        completions: {
          create: jest.fn(async (opts) => {
            calls.push(opts.messages);
            callIdx += 1;
            if (callIdx === 1) return { choices: [{ message: { content: 'First reply' } }] };
            return { choices: [{ message: { content: 'Second reply' } }] };
          }),
        },
      },
    };
    setClient(mockClient);
    await runAgent('First question');
    await runAgent('Second question');
    expect(calls.length).toBe(2);
    expect(calls[1].length).toBeGreaterThanOrEqual(calls[0].length + 1);
    const assistantMessages = calls[1].filter((m) => m.role === 'assistant');
    expect(assistantMessages.length).toBeGreaterThanOrEqual(1);
  });
});