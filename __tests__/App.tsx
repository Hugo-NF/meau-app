// Package imports.
import React from 'react';
import { render, waitFor } from 'react-native-testing-library';

// Module imports.
import App from '../src/App';

// Suite configuration.
jest.useFakeTimers();

const createTestProps = (props?: Record<string, unknown>): Record<string, unknown> => ({
  ...props,
});

// Tests.
describe('App', () => {
  const props = createTestProps();
  it('should render Bugstenium Rocks!', async () => {
    const { getByText } = render(<App {...props} />);
    await waitFor(() => getByText(/Bugstenium Rocks!/i));
  });
});
