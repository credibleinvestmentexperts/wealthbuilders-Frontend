import React, { useEffect, useState } from "react";
import InfoBox from "../InfoBox/InfoBox";
import Search from "../Search/Search";
import "./UserStats.css";
import { FaEllipsisH } from "react-icons/fa";
import ChangeRole from "../ChangeRole/ChangeRole";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../redux/features/auth/authSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { shortenText } from "../../Pages/Profile/UserProfile/UserProfile";
import Loader from "../Loader/Loader";
import {
  FILTER_USERS,
  selectUsers,
} from "../../redux/features/auth/filterSlice";
import { useNavigate } from "react-router-dom";

const UserStats = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const { users, isLoading } = useSelector((state) => state.auth);
  const filteredUsers = useSelector(selectUsers);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const removeUser = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(getUsers());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This User",
      message: "Are you sure to delete this user?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeUser(id),
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const impersonateUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/users/impersonate/${userId}`,
        {
          method: "POST",
          credentials: "include", // Store JWT in cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(`You are now impersonating ${data.message}`);
      window.location.reload(); // Reload to apply new session
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    dispatch(FILTER_USERS({ users, search }));
  }, [dispatch, users, search]);

  const toggleMenu = (id) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const openChangeRoleModal = (id, email) => {
    setSelectedUser({ id, email });
    setIsModalOpen(true);
  };

  const closeChangeRoleModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="userStats">
        <InfoBox />
        <div className="userCon">
          <h2>All Users</h2>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="userCardContainer">
          {!isLoading && users.length === 0 ? (
            <p>No user found...</p>
          ) : (
            filteredUsers.map((user, index) => {
              const {
                _id,
                name,
                email,
                role,
                photo,
                country,
                totalMaturityAmount,
                phone,
                balance,
                kycStatus,
                fees,
                hasFees,
              } = user;
              return (
                <div className="userCard" key={_id}>
                  <div className="cardHeader">
                    <img
                      src={photo}
                      alt={`${name}'s avatar`}
                      className="allUserImage"
                    />
                    <FaEllipsisH
                      size={20}
                      className="menuIcon"
                      onClick={() => toggleMenu(_id)}
                    />
                    {menuOpen[_id] && (
                      <div className="dropdown-menu-role">
                        <button onClick={() => openChangeRoleModal(_id, email)}>
                          Change Role
                        </button>
                        <button
                          onClick={() => confirmDelete(_id)}
                          style={{ color: "red" }}
                        >
                          Delete User
                        </button>
                        <button
                          onClick={() => navigate(`/edit-balance/${_id}`)}
                          style={{ color: "#2e8b57" }}
                        >
                          Edit Total-profit
                        </button>
                        <button
                          onClick={() => navigate(`/edit-user-balance/${_id}`)}
                          style={{ color: "#2e8b57" }}
                        >
                          Edit balance
                        </button>
                        <button
                          onClick={() => navigate(`/update-fee/${_id}`)}
                          style={{ color: "#2e8b57" }}
                        >
                          Fees
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="cardBody">
                    <h3>{shortenText(name, 12)}</h3>
                    <p>{email}</p>
                    <p>Phone:{phone}</p>
                    <p>Country: {country || "No Country"}</p>
                    <p>Balance: ${balance.toLocaleString()}</p>
                    <p>Total-profit: ${totalMaturityAmount.toLocaleString()}</p>
                    <p>Role: {role}</p>
                    <p>Kyc Status: {kycStatus}</p>
                    <p>Fees: {fees.toLocaleString()}</p>
                    <p>Fees Status: {hasFees.toString()}</p>
                    <button
                      onClick={() => impersonateUser(_id)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "5px",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "5px",
                      }}
                    >
                      Impersonate
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ChangeRole _id={selectedUser.id} email={selectedUser.email} />
            <button className="cancel-btn" onClick={closeChangeRoleModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <ChangeRole
        isOpen={isModalOpen}
        onClose={closeChangeRoleModal}
        _id={selectedUser.id}
        email={selectedUser.email}
      />
    </>
  );
};

export default UserStats;
