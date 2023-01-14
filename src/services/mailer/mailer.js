import { partial } from '@oldbros/shiftjs';

const generateEmail = ({ title, email }) => `${title} ${email}`;

const sendEmail = ({ email }) => {
  console.log('Email sent');
  return Promise.resolve(email);
};

const signinEventHandler = async (deps, event) => {
  const email = generateEmail({
    ...event,
    title: 'You are signed in',
  });
  await sendEmail({ email });
};

const signupEventHandler = async (deps, event) => {
  const email = generateEmail({
    ...event,
    title: 'You are signed up',
  });
  await sendEmail({ email });
};

export const internal = { generateEmail, sendEmail };

export const eventHandlers = {
  'auth.signin.event': signinEventHandler,
  'auth.signup.event': signupEventHandler,
};

export const initEventHandlers = (deps) => ({
  'auth.signin.event': partial(signinEventHandler, deps),
  'auth.signup.event': partial(signupEventHandler, deps),
});
