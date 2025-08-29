declare module 'recorder-js' {
  class Recorder {
    constructor(source: AudioNode, config?: RecorderConfig);
    record(): void;
    stop(): void;
    clear(): void;
    getBuffer(callback: (buffers: Float32Array[]) => void): void;
    exportWAV(callback: (blob: Blob) => void, mimeType?: string): void;
  }

  interface RecorderConfig {
    bufferLen?: number;
    numChannels?: number;
    mimeType?: string;
    callback?: (...args: unknown[]) => void;
  }

  export = Recorder;
}
