import React from 'react';
import { render } from 'react-native-testing-library';
import App from '../src/App';

jest.useFakeTimers();

const createTestProps = (props?: object) => ({
  ...props,
});
describe('App', () => {
  const props = createTestProps();
  const { getByText } = render(<App {...props} />);
  it('should render a welcome', () => {
    expect(getByText(/working/i)).toBeDefined();
  });
});
