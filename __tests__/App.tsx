import React from 'react';
import { render } from 'react-native-testing-library';
import App from '../src/App';

jest.useFakeTimers();

const createTestProps = (props?: Record<string, unknown>): Record<string, unknown> => ({
  ...props,
});

describe('App', () => {
  const props = createTestProps();
  const { getByText } = render(<App {...props} />);
  it('should render Bugstenium Rocks!', () => {
    expect(getByText(/Bugstenium Rocks!/i)).toBeDefined();
  });
});
