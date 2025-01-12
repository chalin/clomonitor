import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FilterKind, Maturity } from '../../../types';
import Section from './Section';

const mockOnChange = jest.fn();

const defaultProps = {
  section: {
    name: FilterKind.Maturity,
    title: 'Maturity level',
    filters: [
      { name: Maturity.Graduated, label: 'Graduated' },
      { name: Maturity.Incubating, label: 'Incubating' },
      { name: Maturity.Sandbox, label: 'Sandbox' },
    ],
  },
  activeFilters: [],
  onChange: mockOnChange,
  device: 'test',
};

describe('Section', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', () => {
    const { asFragment } = render(<Section {...defaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('renders Section', () => {
      render(<Section {...defaultProps} />);

      expect(screen.getByText('Maturity level')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Graduated' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Incubating' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Sandbox' })).toBeInTheDocument();
    });

    it('renders Section with selected options', () => {
      render(<Section {...defaultProps} activeFilters={['1', '2']} />);

      expect(screen.getByRole('checkbox', { name: 'Incubating' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Sandbox' })).toBeChecked();
    });

    it('calls onChange to click filter', () => {
      render(<Section {...defaultProps} />);

      const check = screen.getByRole('checkbox', { name: 'Incubating' });

      expect(check).not.toBeChecked();

      userEvent.click(check);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('maturity', '1', true);
    });

    it('calls onChange to click selected filter', () => {
      render(<Section {...defaultProps} activeFilters={['0']} />);

      const check = screen.getByRole('checkbox', { name: 'Graduated' });

      expect(check).toBeChecked();

      userEvent.click(check);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('maturity', '0', false);
    });
  });
});
