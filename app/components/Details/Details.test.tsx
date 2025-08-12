import { mock, mockWithIssues, mockWithNonOkStatus } from '../../../mocks/mocks';
import Details from '.';
import { render, screen } from '@testing-library/react';

describe('Details', () => {
  it('does not show an issues line when there are no issues', () => {
    render(<Details lastUpdated={123} data={mock} />);
    expect(screen.queryByText('We seem to be experiencing some issues here.')).not.toBeInTheDocument();
  });

  it('shows an issues line when there are server issues', () => {
    render(<Details lastUpdated={123} data={mockWithIssues} />);
    expect(screen.getByText('We seem to be experiencing some issues here.')).toBeInTheDocument();
  });

  it('shows an issues line when the status is not ok', () => {
    render(<Details lastUpdated={123} data={mockWithNonOkStatus} />);
    expect(screen.getByText('We seem to be experiencing some issues here.')).toBeInTheDocument();
  });
});
