import React from "react";
import { Card, Row, Spin, Col } from "antd";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  reset,
  resetLoading,
}) {
  return (
    <Row gutter={[16, 16]} className="flex flex-wrap justify-center">
      <Col xs={24} sm={12} md={8} lg={6}> {/* Responsive column sizes */}
        <Card className="shadow-lg p-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white">
          <h2 className="text-xl font-semibold">Current Balance</h2>
          <p className="text-2xl font-bold">₹{currentBalance}</p>
          <button
            className="mt-4 bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-100 transition duration-200"
            onClick={reset}
            disabled={resetLoading}
          >
            {resetLoading ? <Spin size="small" /> : "Reset Balance"}
          </button>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="shadow-lg p-6 rounded-lg bg-gradient-to-r from-green-500 to-green-400 text-white">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <p className="text-2xl font-bold">₹{income}</p>
          <button
            className="mt-4 bg-white text-green-500 py-2 px-4 rounded hover:bg-gray-100 transition duration-200"
            onClick={showIncomeModal}
          >
            Add Income
          </button>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8} lg={6}>
        <Card className="shadow-lg p-6 rounded-lg bg-gradient-to-r from-red-500 to-red-400 text-white">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold">₹{expenses}</p>
          <button
            className="mt-4 bg-white text-red-500 py-2 px-4 rounded hover:bg-gray-100 transition duration-200"
            onClick={showExpenseModal}
          >
            Add Expense
          </button>
        </Card>
      </Col>
    </Row>
  );
}

export default Cards;
