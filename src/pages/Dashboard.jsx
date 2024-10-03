import React, { useEffect, useState } from "react";
import { Card, Row } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import TransactionSearch from "../components/TransactionSearch";
import Header from "../components/Header/Header";
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

    function reset() {
        console.log("resetting");
    }

    const cardClass = "shadow-lg rounded-md p-6 m-8 min-w-[400px] flex-1";

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
        <div className="dashboard-container p-6 bg-gray-100 min-h-screen">
            <Header />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Cards
                        currentBalance={currentBalance}
                        income={income}
                        expenses={expenses}
                        showExpenseModal={showExpenseModal}
                        showIncomeModal={showIncomeModal}
                        cardClass={cardClass}
                        reset={reset}
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
                            <Row gutter={16}>
                                <Card bordered={true} className={cardClass}>
                                    <h2 className="text-xl font-semibold">Financial Statistics</h2>
                                    <Line {...{ ...balanceConfig, data: balanceData }} />
                                </Card>

                                <Card bordered={true} className={`${cardClass} flex-[0.45]`}>
                                    <h2 className="text-xl font-semibold">Total Spending</h2>
                                    {spendingDataArray.length == 0 ? (
                                        <p>Seems like you haven't spent anything till now...</p>
                                    ) : (
                                        <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                                    )}
                                </Card>
                            </Row>
                        </>
                    )}
                    <TransactionSearch
                        transactions={transactions}
                        exportToCsv={exportToCsv}
                        fetchTransactions={fetchTransactions}
                        addTransaction={addTransaction}
                    />
                </>
            )}
        </div>
    );
}

export default Dashboard;
