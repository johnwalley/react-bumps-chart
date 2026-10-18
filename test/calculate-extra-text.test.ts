import { describe, expect, test } from 'vitest';
import { calculateExtraText } from '@/utils/calculate-extra-text';
import { events } from './fixtures';

describe('calculateExtraText', () => {
  test.each(Object.entries(events))('%s', (_name, event) => {
    expect(
      calculateExtraText(event, 16).map(
        ({ label, pos }) => `${label} @ ${pos.join(',')}`
      )
    ).toMatchSnapshot();
  });
});
