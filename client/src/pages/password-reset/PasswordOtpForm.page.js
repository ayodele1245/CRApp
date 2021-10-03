import React from "react";
import { useSelector } from "react-redux";

import { Jumbotron } from "react-bootstrap";
import { ResetPassword } from "../../components/password-reset/PasswordReset.comp";
import UpdatePasswordForm from "../../components/password-reset/UpdatePasswordForm.comp";

import "./passwordOtpForm.style.css";


export const PasswordOtpForm = () => {
	const { showUpdatePassForm } = useSelector(state => state.password);

	return (
		<div className="passwd-page ">
			<Jumbotron className="form-box">
				{showUpdatePassForm ? <UpdatePasswordForm /> : <ResetPassword />}
				<div className="text-center">
					<a href="/">Login Now</a>
				</div>
			</Jumbotron>
		</div>
	);
};
