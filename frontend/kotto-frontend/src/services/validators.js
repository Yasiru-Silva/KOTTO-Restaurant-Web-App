export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRegister({ name, email, password }) {
  const errors = {};
  if (!name.trim()) errors.name = "Full name is required";
  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email format";
  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email format";
  if (!password) errors.password = "Password is required";
  return errors;
}