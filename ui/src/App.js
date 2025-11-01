import logo from './logo.png';
import './App.css';
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    localSalesCount: '',
    foreignSalesCount: '',
    averageSaleAmount: ''
  });

  const [errors, setErrors] = useState({});
  const [results, setResults] = useState({
    avalphaTechnologiesCommission: 0,
    competitorCommission: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' })); // clear field error when user types
  };

  const validateForm = () => {
    const newErrors = {};
    const { localSalesCount, foreignSalesCount, averageSaleAmount } = formData;

    const maxSales = 1_000_000;
    const maxAverage = 10_000_000;

    if (localSalesCount === '' || localSalesCount < 0)
      newErrors.localSalesCount = 'Local sales count must be 0 or more.';
    else if (localSalesCount > maxSales)
      newErrors.localSalesCount = `Local sales count cannot exceed ${maxSales}.`;

    if (foreignSalesCount === '' || foreignSalesCount < 0)
      newErrors.foreignSalesCount = 'Foreign sales count must be 0 or more.';
    else if (foreignSalesCount > maxSales)
      newErrors.foreignSalesCount = `Foreign sales count cannot exceed ${maxSales}.`;

    if (averageSaleAmount === '' || averageSaleAmount < 0)
      newErrors.averageSaleAmount = 'Average sale amount must be 0 or more.';
    else if (averageSaleAmount > maxAverage)
      newErrors.averageSaleAmount = `Average sale amount cannot exceed £${maxAverage}.`;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('https://localhost:5000/api/Commission/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          localSalesCount: Number(formData.localSalesCount),
          foreignSalesCount: Number(formData.foreignSalesCount),
          averageSaleAmount: Number(formData.averageSaleAmount)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('API Error:', errData);
        alert('⚠️ Validation error from server. Check your inputs.');
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      setResults({
        avalphaTechnologiesCommission: data.avalphaTechnologies?.total || 0,
        competitorCommission: data.competitor?.total || 0
      });
    } catch (err) {
      console.error('Error calculating commission:', err);
      alert('❌ Failed to calculate commission. Please ensure backend is running and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} className="App-logo" alt="Avalpha Technologies Logo" />
          <h1 className="company-title">Avalpha Technologies</h1>
          <h2 className="app-subtitle">Commission Calculator</h2>
        </div>
      </header>

      <main className="main-content">
        <div className="calculator-container">
          <div className="form-section">
            <h3>Sales Information</h3>
            <form onSubmit={handleSubmit} className="calculator-form">
              <div className="form-group">
                <label htmlFor="localSalesCount">Local Sales Count</label>
                <input
                  type="number"
                  id="localSalesCount"
                  name="localSalesCount"
                  value={formData.localSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of local sales"
                  required
                />
                {errors.localSalesCount && (
                  <small className="error-text">{errors.localSalesCount}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="foreignSalesCount">Foreign Sales Count</label>
                <input
                  type="number"
                  id="foreignSalesCount"
                  name="foreignSalesCount"
                  value={formData.foreignSalesCount}
                  onChange={handleInputChange}
                  placeholder="Enter number of foreign sales"
                  required
                />
                {errors.foreignSalesCount && (
                  <small className="error-text">{errors.foreignSalesCount}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="averageSaleAmount">Average Sale Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  id="averageSaleAmount"
                  name="averageSaleAmount"
                  value={formData.averageSaleAmount}
                  onChange={handleInputChange}
                  placeholder="Enter average sale amount"
                  required
                />
                {errors.averageSaleAmount && (
                  <small className="error-text">{errors.averageSaleAmount}</small>
                )}
              </div>

              <button
                type="submit"
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Calculating...' : 'Calculate Commission'}
              </button>
            </form>
          </div>

          <div className="results-section">
            <h3>Commission Results</h3>
            <div className="results-grid">
              <div className="result-card avalpha-card">
                <div className="result-header">
                  <h4>Avalpha Technologies</h4>
                  <span className="commission-rates">Local: 20% | Foreign: 35%</span>
                </div>
                <div className="result-amount">
                  £{results.avalphaTechnologiesCommission}
                </div>
              </div>

              <div className="result-card competitor-card">
                <div className="result-header">
                  <h4>Competitor</h4>
                  <span className="commission-rates">Local: 2% | Foreign: 7.55%</span>
                </div>
                <div className="result-amount">
                  £{results.competitorCommission}
                </div>
              </div>
            </div>

            {results.avalphaTechnologiesCommission > 0 && (
              <div className="advantage-indicator">
                <p className="advantage-text">
                  Avalpha Technologies advantage:
                  <strong>
                    {' '}
                    £
                    {(results.avalphaTechnologiesCommission -
                      results.competitorCommission).toFixed(2)}
                  </strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Avalpha Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
