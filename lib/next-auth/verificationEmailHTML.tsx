export const verificationEmailHTML = (email: string, verificationLink: string) => `<html>
	<body
		style="margin: 0; padding: 0; background: #ffffff; color: #000000; font-family: sans-serif"
	>
		<div
			style="
				max-width: 500px;
				margin: 40px auto;
				padding: 40px 30px;
				border: 1px solid #dcdcdc;
				border-radius: 6px;
				text-align: left;
				font-size: 14px;
			"
		>
			<div style="text-align: center; margin-bottom: 30px">
				<a
					href="https://www.willowbridgepc.com"
					target="_blank"
					style="
						background-color: #362b51;
						max-width: 125px;
						width: 100%;
						max-height: 46.2px;
						height: 100%;
						display: inline-block;
						padding-top: 0.5rem;
						padding-bottom: 0.25rem;
						padding-left: 2rem;
						padding-right: 2rem;
					"
				>
					<img
						src="https://www.willowbridgepc.com/themes/lincoln-2021/corp/main/shared/images/header_logo_w.png"
						alt="Willow Bridge Logo"
						style="width: 100%; height: 100%"
					/>
				</a>
			</div>

			<p style="text-align: center; font-size: 20px; margin-bottom: 20px">
				Verify your email to sign in to <strong>Willow Bridge</strong>
			</p>

			<p>
				Someone's attempting to sign into Willow Bridge with your email
				(<strong>${email}</strong>).
			</p>
			<p>To complete the sign-in process, click the sign-in button below.</p>

			<div style="text-align: center; margin: 30px 0">
				<a
					href="${verificationLink}"
					style="
						background: #362b51;
						color: #ffffff;
						padding: 10px 30px;
						border-radius: 4px;
						text-decoration: none;
						display: inline-block;
					"
				>
					Sign In
				</a>
			</div>

			<hr style="margin: 30px 0; border: none; border-top: 1px solid #dcdcdc" />

			<p style="font-size: 12px; line-height: 1.8; color: #666">
				If you didn't attempt to sign in but received this email, or if the location doesn't
				match, please ignore this email. Don't share or forward this email. Our customer
				service will never ask for it. Be cautious of phishing attempts and always verify
				the sender and domain (<a
					href="https://www.willowbridgepc.com"
					style="color: rgb(32, 164, 243)"
					>willowbridgepc.com</a
				>) before acting. If concerned about your account's safety, please get in touch with
				us.
			</p>
		</div>
	</body>
</html>
`;
