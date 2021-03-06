// Package imports.
import React from 'react';
import { cleanup, render } from '@testing-library/react-native';

// Component imports.
import MockedNavigation from '../src/mocks/MockedNavigation';

// Module imports.
import Home from '../src/pages/Home';

// Suite configuration.
const createTestProps = (props?: Record<string, unknown>): Record<string, unknown> => ({
  ...props,
});

afterEach(cleanup);

// Tests.
describe('Home', () => {
  // Variable declaration.
  const props = createTestProps();
  const component = (
    <MockedNavigation {...props} component={Home} />
  );

  // Tests.
  it('should render Bugstenium Rocks!', async () => {
    const { findByText } = render(component);
    const mainText = await findByText(/Bugstenium rocks!/i);
    expect(mainText).toBeTruthy();
  });
});
