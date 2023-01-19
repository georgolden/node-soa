const generateEmail = ({ title, email }) => `${title} ${email}`;

const sendEmail = ({ email }) => {
  console.log('Email sent');
  return Promise.resolve(email);
};

export const signinEventHandler = async (deps, event) => {
  const email = generateEmail({
    ...event,
    title: 'You are signed in',
  });
  await sendEmail({ email });
};

export const signupEventHandler = async (deps, event) => {
  const email = generateEmail({
    ...event,
    title: 'You are signed up',
  });
  await sendEmail({ email });
};

export const internal = { generateEmail, sendEmail };
