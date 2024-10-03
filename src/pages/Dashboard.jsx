import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import TransactionSearch from "../components/TransactionSearch";
import Header from "../components/Header/Header"; // Updated Header component
import AddIncomeModal from "../components/Modals/AddIncome";
import AddExpenseModal from "../components/Modals/AddExpense";
import Cards from "../components/Cards";
import NoTransactions from "../components/NoTransaction";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import Loader from "../components/Loader/Loader";
import { toast } from "react-toastify";
import { unparse } from "papaparse";

function Dashboard() {
    const [user] = useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [resetLoading, setResetLoading] = useState(false); // Loading state for reset

    const processChartData = () => {
        const balanceData = [];
        const spendingData = {};

        transactions.forEach((transaction) => {
            const monthYear = moment(transaction.date).format("MMM YYYY");
            const tag = transaction.tag;

            if (transaction.type === "income") {
                if (balanceData.some((data) => data.month === monthYear)) {
                    balanceData.find((data) => data.month === monthYear).balance +=
                        transaction.amount;
                } else {
                    balanceData.push({ month: monthYear, balance: transaction.amount });
                }
            } else {
                if (balanceData.some((data) => data.month === monthYear)) {
                    balanceData.find((data) => data.month === monthYear).balance -=
                        transaction.amount;
                } else {
                    balanceData.push({ month: monthYear, balance: -transaction.amount });
                }

                if (spendingData[tag]) {
                    spendingData[tag] += transaction.amount;
                } else {
                    spendingData[tag] = transaction.amount;
                }
            }
        });

        const spendingDataArray = Object.keys(spendingData).map((key) => ({
            category: key,
            value: spendingData[key],
        }));

        return { balanceData, spendingDataArray };
    };

    const { balanceData, spendingDataArray } = processChartData();
    
    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    };

    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    };

    const handleExpenseCancel = () => {
        setIsExpenseModalVisible(false);
    };

    const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: moment(values.date).format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };

        setTransactions([...transactions, newTransaction]);
        setIsExpenseModalVisible(false);
        setIsIncomeModalVisible(false);
        addTransaction(newTransaction);
        calculateBalance();
    };

    const calculateBalance = () => {
        let incomeTotal = 0;
        let expensesTotal = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                incomeTotal += transaction.amount;
            } else {
                expensesTotal += transaction.amount;
            }
        });

        setIncome(incomeTotal);
        setExpenses(expensesTotal);
        setCurrentBalance(incomeTotal - expensesTotal);
    };

    useEffect(() => {
        calculateBalance();
    }, [transactions]);

    async function addTransaction(transaction, many) {
        try {
            const docRef = await addDoc(
                collection(db, `users/${user.uid}/transactions`),
                transaction
            );
            console.log("Document written with ID: ", docRef.id);
            if (!many) {
                toast.success("Transaction Added!");
            }
        } catch (e) {
            console.error("Error adding document: ", e);
            if (!many) {
                toast.error("Couldn't add transaction");
            }
        }
    }

    async function fetchTransactions() {
        setLoading(true);
        if (user) {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                transactionsArray.push(doc.data());
            });
            setTransactions(transactionsArray);
            toast.success("Transactions Fetched!");
        }
        setLoading(false);
    }

    const balanceConfig = {
        data: balanceData,
        xField: "month",
        yField: "balance",
    };

    const spendingConfig = {
        data: spendingDataArray,
        angleField: "value",
        colorField: "category",
    };

    const reset = async () => {
        setResetLoading(true);
        setTransactions([]); // Reset transactions
        setIncome(0);
        setExpenses(0);
        setCurrentBalance(0);

        try {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await doc.ref.delete(); // Delete each transaction document
            });
            toast.success("Transactions reset successfully!");
        } catch (error) {
            console.error("Error resetting transactions: ", error);
            toast.error("Error resetting transactions.");
        } finally {
            setResetLoading(false);
        }
    };

    const cardClass = "shadow-lg rounded-lg p-6 m-4 bg-white flex-1 transition-transform duration-300 hover:scale-105";

    function exportToCsv() {
        const csv = unparse(transactions, {
            fields: ["name", "type", "date", "amount", "tag"],
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <div className="mt-16"> {/* Add margin to push content below the fixed header */}
                {loading ? (
                    <Loader />
                ) : (
                    <div className="flex flex-col p-6 space-y-6">
                        <Cards
                            currentBalance={currentBalance}
                            income={income}
                            expenses={expenses}
                            showExpenseModal={showExpenseModal}
                            showIncomeModal={showIncomeModal}
                            cardClass={cardClass}
                            reset={reset}
                            resetLoading={resetLoading} // Pass reset loading state
                        />

                        <AddExpenseModal
                            isExpenseModalVisible={isExpenseModalVisible}
                            handleExpenseCancel={handleExpenseCancel}
                            onFinish={onFinish}
                        />
                        <AddIncomeModal
                            isIncomeModalVisible={isIncomeModalVisible}
                            handleIncomeCancel={handleIncomeCancel}
                            onFinish={onFinish}
                        />
                        {transactions.length === 0 ? (
                            <NoTransactions />
                        ) : (
                            <>
                                <Row gutter={16} justify="space-between">
                                    <Col xs={24} sm={12} md={12} lg={12}>
                                        <Card bordered={true} className={cardClass}>
                                            <h2 className="text-2xl font-semibold text-gray-800">Financial Statistics</h2>
                                            <Line {...{ ...balanceConfig, data: balanceData }} />
                                        </Card>
                                    </Col>

                                    <Col xs={24} sm={12} md={12} lg={12}>
                                        <Card bordered={true} className={cardClass}>
                                            <h2 className="text-2xl font-semibold text-gray-800">Total Spending</h2>
                                            {spendingDataArray.length === 0 ? (
                                                <p className="text-gray-500">Seems like you haven't spent anything till now...</p>
                                            ) : (
                                                <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}
                        <TransactionSearch
                            transactions={transactions}
                            exportToCsv={exportToCsv}
                            fetchTransactions={fetchTransactions}
                            addTransaction={addTransaction}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
