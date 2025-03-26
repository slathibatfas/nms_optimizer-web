import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GridCell from './GridCell';
import { Grid, Cell } from '../../store/useGridStore';

import { describe } from '@jest/globals'

describe('GridCell', () => {
  it('calls toggleCellActive and toggleCellSupercharged with correct arguments when clicked', () => {
    const mockToggleCellActive = jest.fn();
    const mockToggleCellSupercharged = jest.fn();
    const mockSetShaking = jest.fn();
    const rowIndex = 2;
    const columnIndex = 3;

    // Mock the useGridStore hook to return our mock functions
    jest.mock('../../store/useGridStore', () => ({
      ...jest.requireActual('../../store/useGridStore'), // Import the actual module
      useGridStore: (selector: (state: { toggleCellActive: () => void; toggleCellSupercharged: () => void }) => unknown) => {
        const state = {
          toggleCellActive: mockToggleCellActive,
          toggleCellSupercharged: mockToggleCellSupercharged,
        };
        return selector(state);
      },    }));

    const grid: Grid = {
      width: 4,
      height: 3,
      cells: [
        [
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
        ],
        [
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
        ],
        [
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
          {
            module: null,
            label: '',
            value: 0,
            type: '',
            total: 0.0,
            adjacency_bonus: 0.0,
            bonus: 0.0,
            active: true,
            adjacency: false,
            tech: null,
            supercharged: false,
            sc_eligible: false,
            image: null,
          },
        ],
      ],
    };

    // Define a default cell object
    const defaultCell: Cell = {
      module: null,
      label: '',
      value: 0,
      type: '',
      total: 0.0,
      adjacency_bonus: 0.0,
      bonus: 0.0,
      active: true,
      adjacency: false,
      tech: null,
      supercharged: false,
      sc_eligible: false,
      image: null,
    };

    render(
      <GridCell
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        cell={{
          label: defaultCell.label,
          supercharged: defaultCell.supercharged,
          active: defaultCell.active,
          image: defaultCell.image || undefined,
        }}
        grid={grid}
        setShaking={mockSetShaking}
      />
    );

    const cellElement = screen.getByRole('gridCell');
    fireEvent.click(cellElement, { ctrlKey: true });
    expect(mockToggleCellActive).toHaveBeenCalledWith(rowIndex, columnIndex);

    fireEvent.click(cellElement);
    expect(mockToggleCellSupercharged).toHaveBeenCalledWith(rowIndex, columnIndex);
  });
});
