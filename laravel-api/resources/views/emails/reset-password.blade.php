<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password</title>
</head>
<body>
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/reset-password?token={{ $token }}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
</body>
</html>
