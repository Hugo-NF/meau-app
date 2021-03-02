// Package imports.
import React from 'react';
import { cleanup, render } from '@testing-library/react-native';

// Module imports.
import App from '../src/App';

// Suite configuration.
const createTestProps = (props?: Record<string, unknown>): Record<string, unknown> => ({
  ...props,
});

afterEach(cleanup);

// Tests.
describe('App', () => {
  // Variable declaration.
  const props = createTestProps();

  // Tests.
  it('should render Bugstenium Rocks!', async () => {
    const { findByText } = render(<App {...props} />);
    const mainText = await findByText(/Bugstenium rocks!/i);
    expect(mainText).toBeTruthy();
  });
});
