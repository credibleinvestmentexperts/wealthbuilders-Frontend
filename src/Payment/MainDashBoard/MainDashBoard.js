import axios from "axios";
import "./MainDashBoard.css";
import React, { useEffect, useState } from "react";
import Notification from "../../components/Notification/Notification";
import PaymentLoader from "../PaymentLoader/PaymentLoader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { NameOfUser } from "../../Pages/Profile/UserProfile/UserProfile";
import DashLoader from "../DashLoader/DashLoader";
import { selectUser } from "../../redux/features/auth/authSlice";
import { useSelector } from "react-redux";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const GET_ONE_USER = `${BACKEND_URL}api/users`;
export const CHECK_MATURITY = `${BACKEND_URL}api/invest/deposit-maturity`;

const MainDashBoard = () => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [fees, setFees] = useState(0);
  const [totalMaturityAmount, setTotalMaturityAmount] = useState(0);
  const [InvestmentBal, setInvestmentBal] = useState(0);
  const [error, setError] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showInvestmentBal, setShowInvestmentBal] = useState(true);
  const [showMaturityAmount, setShowMaturityAmount] = useState(true);
  const [hasFees, setHasFees] = useState(false);

  const [loading, setLoading] = useState(true);

  const user = useSelector(selectUser);

  const formatBalance = (balance) => {
    return balance.toLocaleString();
  };

  const formatInvestBalance = (InvestmentBal) => {
    return InvestmentBal.toLocaleString();
  };

  const formatMaturitytBalance = (totalMaturityAmount) => {
    return totalMaturityAmount.toLocaleString();
  };

  const userDetails = async () => {
    setLoading(true);
    try {
      await axios.get(CHECK_MATURITY);
      const response = await axios.get(`${GET_ONE_USER}/getUser`);
      console.log("Full Response:", response.data);

      setName(response.data.name);
      setBalance(response.data.balance);
      setInvestmentBal(response.data.investmentBalance);
      setFees(response.data.fees);
      setTotalMaturityAmount(response.data.totalMaturityAmount);
      setHasFees(response.data.hasFees);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false); // Stop loading when data is fetched or error occurs
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  useRedirectLoggedOutUser("/login");

  return (
    <>
      <div className="mainDashBoard">
        <div className="mainDashBoardContainer">
          <div className="welName">
            <h2>Welcome Back,</h2>
            <p className="smallScreen">
              {loading ? <DashLoader /> : <NameOfUser />}
            </p>
            <p className="maxScreen">{loading ? <DashLoader /> : user?.name}</p>
          </div>
          <div className="balance">
            <span
              className="depoSpan"
              onClick={() => setShowBalance(!showBalance)}
            >
              <p className="dBal">Deposit Balance</p>
              <p className="mBal">
                {loading ? <DashLoader /> : `$${formatBalance(balance)}`}
              </p>
            </span>
            <span
              className="depoSpan"
              onClick={() => setShowInvestmentBal(!showInvestmentBal)}
            >
              <p className="dBal">Total Investment</p>
              <p className="mBal">
                {loading ? (
                  <DashLoader />
                ) : (
                  `$${formatInvestBalance(InvestmentBal)}`
                )}
              </p>
            </span>
            {/* <span
              className="depoSpan"
              onClick={() => setShowInvestmentBal(!showInvestmentBal)}
            >
              <p className="dBal">Investment Fees</p>
              <p className="mBal">
                {loading ? (
                  <DashLoader />
                ) : (
                  `$${formatInvestBalance(fees)}`
                )}
              </p>
            </span> */}
            {hasFees && (
              <span
                className="depoSpan"
                onClick={() => setShowInvestmentBal(!showInvestmentBal)}
              >
                <p className="dBal">Investment Fees</p>
                <p className="mBal">
                  {loading ? <DashLoader /> : `$${formatInvestBalance(fees)}`}
                </p>
              </span>
            )}

            <span
              className="depoSpan"
              onClick={() => setShowMaturityAmount(!showMaturityAmount)}
            >
              <p className="dBal">Total Profit</p>
              <p className="mBal">
                {loading ? (
                  <DashLoader />
                ) : (
                  `$${formatMaturitytBalance(totalMaturityAmount)}`
                )}
              </p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDashBoard;
