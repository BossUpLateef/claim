import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RebuttalProvider } from '../context/RebuttalContext';
import RebuttalPage from '../app/page';

describe('RebuttalPage', () => {
  const renderWithProvider = (ui: React.ReactNode) => {
    return render(
      <RebuttalProvider>
        {ui}
      </RebuttalProvider>
    );
  };

  it('renders without crashing', () => {
    renderWithProvider(<RebuttalPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    renderWithProvider(<RebuttalPage />);
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'California' }
    });
    fireEvent.change(screen.getByLabelText(/carrier/i), {
      target: { value: 'TestCarrier' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/rebuttal generated/i)).toBeInTheDocument();
    });
  });

  it('handles search functionality', () => {
    renderWithProvider(<RebuttalPage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput).toHaveValue('test search');
  });
}); 