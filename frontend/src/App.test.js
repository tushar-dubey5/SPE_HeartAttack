import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app with navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check for the presence of navigation elements or common elements
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
