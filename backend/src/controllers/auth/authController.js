const User = require('../../models/User');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { signToken } = require('../../utils/jwt');

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const user = await User.create({ name, email, phone, password, role });
  const token = signToken({ id: user._id, role: user.role });
  res.status(201).json({ token, user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');
  const token = signToken({ id: user._id, role: user.role });
  res.json({ token, user });
});

module.exports = { register, login };
