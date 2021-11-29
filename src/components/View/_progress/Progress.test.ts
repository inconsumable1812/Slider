import Progress from './Progress';

const isVertical = true;

describe('progress', () => {
  let progress: Progress;
  let progressVertical: Progress;
  beforeEach(() => {
    progress = new Progress(!isVertical);
    progressVertical = new Progress(isVertical);
  });

  test('check set style in horizontal slider', () => {
    progress.setStyle(10, 60);
    expect(progress.element.style.left).toBe('10%');
    expect(progress.element.style.right).toBe('40%');
  });

  test('check set style in vertical slider', () => {
    progressVertical.setStyle(15, 65);
    expect(progressVertical.element.style.top).toBe('15%');
    expect(progressVertical.element.style.bottom).toBe('35%');
  });

  test('check correct change orientation to vertical', () => {
    progress.setOrientation(true);
    progress.setStart(5);
    expect(progress.element.style.top).toBe('5%');
  });

  test('check correct change orientation to horizontal', () => {
    progressVertical.setOrientation(false);
    progressVertical.setStart(33);
    expect(progressVertical.element.style.left).toBe('33%');
  });
});
