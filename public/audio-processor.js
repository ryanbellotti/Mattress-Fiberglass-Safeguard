class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const inputChannel = input[0];

      // Append to buffer
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex++] = inputChannel[i];

        if (this.bufferIndex >= this.bufferSize) {
          this.flush();
        }
      }
    }
    return true;
  }

  flush() {
    const inputData = this.buffer;

    // Calculate volume
    let sum = 0;
    for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
    const volume = (sum / inputData.length) * 100;

    // Convert to PCM16
    const pcm16 = this.float32To16BitPCM(inputData);

    // Post message
    this.port.postMessage({
      volume,
      pcmBuffer: pcm16.buffer
    }, [pcm16.buffer]);

    // Reset buffer index
    this.bufferIndex = 0;
  }

  float32To16BitPCM(float32Arr) {
    const l = float32Arr.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, float32Arr[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
  }
}

registerProcessor('audio-processor', AudioProcessor);
