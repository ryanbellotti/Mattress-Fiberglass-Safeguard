import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { resizeImage } from './imageUtils.ts';

describe('resizeImage', () => {
  let originalWindow: any;
  let originalDocument: any;
  let originalImage: any;

  // Controls for the mock
  let mockImageWidth = 2000;
  let mockImageHeight = 2000;
  let shouldFailLoad = false;
  let drawImageMock = mock.fn();

  before(() => {
    originalWindow = (global as any).window;
    originalDocument = (global as any).document;
    originalImage = (global as any).Image;

    (global as any).window = {};

    (global as any).document = {
      createElement: (tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: (contextId: string) => {
              if (contextId === '2d') {
                return {
                  drawImage: drawImageMock,
                };
              }
              return null;
            },
            toDataURL: (type: string) => `data:${type};base64,resizeddata`,
          };
        }
        return {};
      },
    };

    class MockImage {
      src: string = '';
      width: number = 0;
      height: number = 0;
      onload: (() => void) | null = null;
      onerror: ((err: any) => void) | null = null;

      constructor() {
        setTimeout(() => {
          if (shouldFailLoad) {
            if (this.onerror) this.onerror(new Error('Load error'));
          } else {
            this.width = mockImageWidth;
            this.height = mockImageHeight;
            if (this.onload) this.onload();
          }
        }, 10);
      }
    }
    (global as any).Image = MockImage;
  });

  after(() => {
    (global as any).window = originalWindow;
    (global as any).document = originalDocument;
    (global as any).Image = originalImage;
  });

  it('should resize large image', async () => {
    mockImageWidth = 2000;
    mockImageHeight = 2000;
    shouldFailLoad = false;
    drawImageMock.mock.resetCalls();

    const result = await resizeImage('originaldata', 'image/jpeg', 1000, 1000);
    assert.strictEqual(result, 'resizeddata');

    // Check if drawImage was called
    assert.strictEqual(drawImageMock.mock.calls.length, 1);
    // arguments: img, 0, 0, width, height
    const args = drawImageMock.mock.calls[0].arguments;
    assert.strictEqual(args[3], 1000); // width
    assert.strictEqual(args[4], 1000); // height
  });

  it('should not resize small image', async () => {
    mockImageWidth = 500;
    mockImageHeight = 500;
    shouldFailLoad = false;
    drawImageMock.mock.resetCalls();

    const result = await resizeImage('originaldata', 'image/jpeg', 1000, 1000);
    assert.strictEqual(result, 'originaldata');
    assert.strictEqual(drawImageMock.mock.calls.length, 0);
  });

  it('should handle load error', async () => {
    shouldFailLoad = true;
    const result = await resizeImage('originaldata', 'image/jpeg');
    assert.strictEqual(result, 'originaldata');
  });
});
