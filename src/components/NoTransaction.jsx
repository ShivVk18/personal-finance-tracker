import React from 'react';
import transactions from '../assets/transactions.svg';

function NoTransaction() {
  return (
    <div className="flex flex-col items-center justify-center w-full mb-8">
      <img src={transactions} className="w-[400px] my-16" alt="No Transactions" />
      <p className="text-center text-lg">
        You Have No Transactions Currently
      </p>
    </div>
  );
}

export default NoTransaction;
