import React from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './TransactionHistory.css';

const TransactionHistory = ({ 
  transactions, 
  status, 
  error, 
  page, 
  limit, 
  total, 
  onPageChange 
}) => {
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'failed') {
    return <ErrorMessage message={error} />;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="no-transactions">
          <span className="icon">💰</span>
          <p>No transactions found</p>
        </div>
      ) : (
        <>
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className={`point-change ${transaction.pointChange >= 0 ? 'positive' : 'negative'}`}>
                    {transaction.pointChange >= 0 ? '+' : ''}{transaction.pointChange}
                  </span>
                  <span className="reason">{transaction.reason}</span>
                </div>
                <div className="transaction-meta">
                  <span className="balance">Balance: {transaction.newBalance}</span>
                  <span className="timestamp">
                    {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                    {new Date(transaction.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </button>
              
              <div className="page-info">
                Page {page} of {totalPages}
              </div>
              
              <button
                className="page-button"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
