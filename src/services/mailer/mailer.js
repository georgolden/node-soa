export default class MailerService {
  constructor({ bus }) {
    this.bus = bus;

    this.bus.subscribe('signin', async (event) => {
      const email = this.#generateEmail({
        ...event,
        title: 'You are signed in',
      });
      await this.#sendEmail({ email });
    });

    this.bus.subscribe('signup', async (event) => {
      const email = this.#generateEmail({
        ...event,
        title: 'You are signed up',
      });
      await this.#sendEmail({ email });
    });
  }

  #generateEmail({ title, email }) {
    return `${title} ${email}`;
  }

  #sendEmail({ email }) {
    console.log('Email sent');
    return Promise.resolve(email);
  }
}
