const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');


//Function to start election
// => api/election/startElection
// admin access
exports.startElection = catchAsyncError(async (req, res, next) => {
   const users = await User.find();
   users.forEach((user) => {
      //sending an email to each user that election has started
      electionEmail(user, `Election has started. Login to vote: ${process.env.REACT_APP_URL}`, next);

      //Updating each user ongoing variable to true
      updateUser(user, true);
   });

   res.status(200).json({
      success: true,
   });
});

//Function to end election
// => api/election/endElection
// admin access
exports.endElection = catchAsyncError(async (req, res, next) => {
   let { address } = req.body;

   //make election ongoing false in user model
   const users = await User.find();
   // let isDraw = false;
   users.forEach((user) => {
      //sending an email to each user that election has ended
      electionEmail(
         user,
         `Election has ended. Visit ${process.env.REACT_APP_URL} to see results`,
         next
      );

      //Updating each user ongoing variable to false
      updateUser(user, false);

      //updating each user has voted to false
      updateUserVote(user);
   });


   res.status(200).json({
      success: true,
   });
});

//function to chcnage user onGoing
async function updateUser(user, bool) {
   await User.findByIdAndUpdate(
      user.id,
      { electionOngoing: bool },
      {
         new: true,
         runValidators: true,
         useFindAndModify: false,
      }
   );
}

//function to change user hasVoted
async function updateUserVote(user) {
   await User.findByIdAndUpdate(
      user.id,
      { hasVoted: false },
      {
         new: true,
         runValidators: true,
         useFindAndModify: false,
      }
   );
}

//function to send email that election has started
async function electionEmail(user, message, next) {
   try {
      await sendEmail({
         email: user.email,
         subject: 'Election',
         message,
      });
   } catch (error) {
      return next(new ErrorHandler('Internal Server Error', 500));
   }
}

//function to find winner
function sortCandidate(candidates, next) {
   candidates.sort((a, b) => a.votes - b.votes);
   return candidates;
   //arr.sort((a,b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
}
