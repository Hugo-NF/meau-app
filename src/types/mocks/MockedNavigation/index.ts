import React from 'react';

// Interfaces.
export interface StackScreen {
  component: React.FC,
  params?: Record<string, unknown>
}
