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

const signupEventHandler = async (event) => {
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

export const initEventHandlers = (deps) => {
  const { bus } = deps;
  for (const [eventName, handler] of Object.entries(eventHandlers)) {
    bus.subscribe(eventName, partial(handler, deps));
  }
};
