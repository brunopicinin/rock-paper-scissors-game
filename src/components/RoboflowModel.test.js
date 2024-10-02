import React from 'react';
import { act, render } from '@testing-library/react';
import RoboflowModel from './RoboflowModel';

describe('RoboflowModel', () => {
  it('renders the component', async () => {
    global.roboflow = {
      auth: jest.fn(() => ({
        load: jest.fn(() =>
          Promise.resolve({
            configure: jest.fn(),
          })
        ),
      })),
    };
    await act(async () => render(<RoboflowModel onModelLoad={() => {}} onDetection={() => {}} />));
  });

  it('loads and configures the model', async () => {
    const configureMock = jest.fn();
    const loadMock = jest.fn(() =>
      Promise.resolve({
        configure: configureMock,
      })
    );
    global.roboflow = {
      auth: jest.fn(() => ({
        load: loadMock,
      })),
    };
    await act(async () => render(<RoboflowModel onModelLoad={() => {}} onDetection={() => {}} />));
    expect(loadMock).toHaveBeenCalledWith({ model: 'rock-paper-scissors-sxsw', version: 11 });
    expect(configureMock).toHaveBeenCalledWith({ max_objects: 1 });
  });
});
