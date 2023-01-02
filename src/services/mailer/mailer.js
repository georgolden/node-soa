var generateEmail = ({ title, email }) => {
  return `${title} ${email}`;
};

var sendEmail = ({ email }) => {
  console.log('Email sent');
  return Promise.resolve(email);
};

var signinEventHandler = async (event) => {
  const email = generateEmail({
    ...event,
    title: 'You are signed in',
  });
  await sendEmail({ email });
};

var signupEventHandler = async (event) => {
  const email = generateEmail({
    ...event,
    title: 'You are signed up',
  });
  await sendEmail({ email });
};

export var internal = { generateEmail, sendEmail };

export var eventHandlers = {
  signin: signinEventHandler,
  signup: signupEventHandler,
};

export var initEventHandlers = (deps) => {
  const { bus } = deps;
  for (const [eventName, handler] of Object.entries(eventHandlers)) {
    bus.subscribe(eventName, handler);
  }
};
