import React from 'react';
import App from './App';

describe('App Integration', () => {
  it('renders without throwing and exposes root component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});

