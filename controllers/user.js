const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getExperts = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'expert' });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateExpert = catchAsync(async (req, res, next) => {
  if (req.user.role === 'farmer') {
    res.status(400).json({
      status: 'Bad Request',
      results: 'Farmers does not have this option',
    });
  } else {
    const users = await User.findByIdAndUpdate(req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      results: users,
    });
  }
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  // await User.findByIdAndUpdate(req.user.id, { active: false });
  await User.findByIdAndRemove(req.user.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
