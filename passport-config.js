const localStrategy = require("passport-local").Strategy;
const Driver = require("./models/driver");
const bcrypt = require("bcrypt");

const initialize = (passport) => {
  passport.use(
    new localStrategy(
      { passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const user = await Driver.findOne({ username });

          if (!user) {
            return done(null, false, {
              message: "No User with that username found.",
            });
          }

          if (!(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: "Incorrect Password" });
          }

          console.log(user);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (_id, done) => {
    const user = await Driver.findOne({ _id });
    done(null, user);
  });
};

module.exports = initialize;
