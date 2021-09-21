# CRApp
This is for my personal project at Stutern


.env
MONGO_URL=
JWT_REFRESH_SECRET =  
JWT_ACCESS_SECRET = 
REDIS_URL = 
JWT_REFRESH_SECRET_EXP_DAY = 


I used Ethereal Email for pin generation and password reset


//OTP WORKFLOW

// [] Create password reset page
// [] Add request OTP form
// [] Add redux store with Redux-toolkit to handle the network status
// [] sent OTP to email from API (API Already created)
// [] Load form to input OTP and new password
// [] New password must match confirm password, form validation
// [] Connect to API Endpoint (API Already created)
// [] Add reducer through Redux-toolkit to handle the network status and provide the feedback to the user
// [] Send email, OTP and new password to update the password.
