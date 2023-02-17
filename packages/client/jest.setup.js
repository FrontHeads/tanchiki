/* eslint-env jest */

const AudioContext = jest.fn(() => ({
  createBufferSource: jest.fn(() => ({
    buffer: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createBuffer: jest.fn(),
  decodeAudioData: jest.fn(),
  currentTime: 0,
  resume: jest.fn(),
  suspend: jest.fn(),
}));

window.AudioContext = AudioContext;
