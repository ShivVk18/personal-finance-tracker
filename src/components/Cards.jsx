import { Card, Row } from "antd";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset,
}) {
  return (
    <Row
      style={cardStyle} // You can remove this and replace it with Tailwind if possible
      className="flex flex-wrap gap-4 justify-between"
    >
      <Card bordered={true}>
        <h2 className="text-lg font-semibold">Current Balance</h2>
        <p className="text-xl font-bold">₹{currentBalance}</p>
        <div className="btn btn-blue m-0" onClick={reset}>
          Reset Balance
        </div>
      </Card>

      <Card bordered={true}>
        <h2 className="text-lg font-semibold">Total Income</h2>
        <p className="text-xl font-bold">₹{income}</p>
        <div className="btn btn-blue m-0" onClick={showIncomeModal}>
          Add Income
        </div>
      </Card>

      <Card bordered={true}>
        <h2 className="text-lg font-semibold">Total Expenses</h2>
        <p className="text-xl font-bold">₹{expenses}</p>
        <div className="btn btn-blue" onClick={showExpenseModal}>
          Add Expense
        </div>
      </Card>
    </Row>
  );
}

export default Cards;
