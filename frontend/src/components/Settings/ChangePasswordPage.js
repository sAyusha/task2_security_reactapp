import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import PasswordFieldWithLabel from "../Login-Signup/PasswordFieldWithLabel";

const ChangePassword = () => {
    // const { user, setUser } = useContext(UserContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            const response = await axios.put(
                `https://localhost:3001/api/users/updatePassword`,
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setSuccessMessage("Password changed successfully!");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    const handleReset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccessMessage("");
    };

    return (
        <form onSubmit={handlePasswordChange} className="z-100 md:pb-0 pb-0 vsm:pb-10 my-6 flex flex-col gap-4">
            {error && <div className="text-pale-red">{error}</div>}
            {successMessage && (
                <div className="text-pale-green">{successMessage}</div>
            )}

            {/* Current Password */}
            <PasswordFieldWithLabel
                label="Current Password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />

            {/* New Password */}
            <PasswordFieldWithLabel
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* Confirm New Password */}
            <PasswordFieldWithLabel
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex flex-col items-center justify-center md:col-span-2">
                <button
                    type="submit"
                    className="w-full mt-2 bg-blue-dark text-white text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-2 hover:font-bold"
                    style={{ letterSpacing: '2px' }}
                    onClick={handlePasswordChange}
                >
                    CHANGE PASSWORD
                </button>

                <button
                    type="button"
                    className="w-full mt-2 bg-blue-dark dark:bg-dark-slate text-white text-xl font-semibold px-4 py-2 rounded-[2px] vsm:text-base md:mt-4 hover:font-bold"
                    style={{ letterSpacing: '2px' }}
                    onClick={handleReset}
                >
                    RESET
                </button>
            </div>
        </form>
    );
};

export default ChangePassword;
