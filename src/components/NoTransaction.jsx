import React from 'react';
import transactions from '../assets/transactions.svg';

function NoTransaction() {
  return (
    <div className="flex flex-col items-center justify-center w-full mb-8 py-10 bg-white rounded-lg shadow-lg border border-gray-200 px-4 sm:px-8 lg:px-12">
      <img 
        src={transactions} 
        className="w-40 sm:w-48 md:w-64 my-8" // Adjusts image size for different screen sizes
        alt="No Transactions" 
      />
      <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-800">
        No Transactions Found
      </h2>
      <p className="text-center text-sm sm:text-md text-gray-600 mt-2">
        You have no transactions currently.
      </p>
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-1">
        Start adding transactions to keep track of your finances!
      </p>
    </div>
  );
}

export default NoTransaction;

