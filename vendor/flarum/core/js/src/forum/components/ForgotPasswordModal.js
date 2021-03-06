import app from '../../forum/app';
import Modal from '../../common/components/Modal';
import Button from '../../common/components/Button';
import extractText from '../../common/utils/extractText';
import Stream from '../../common/utils/Stream';

/**
 * The `ForgotPasswordModal` component displays a modal which allows the user to
 * enter their email address and request a link to reset their password.
 *
 * ### Attrs
 *
 * - `email`
 */
export default class ForgotPasswordModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    /**
     * The value of the email input.
     *
     * @type {Function}
     */
    this.email = Stream(this.attrs.email || '');

    /**
     * Whether or not the password reset email was sent successfully.
     *
     * @type {Boolean}
     */
    this.success = false;
  }

  className() {
    return 'ForgotPasswordModal Modal--small';
  }

  title() {
    return app.translator.trans('core.forum.forgot_password.title');
  }

  content() {
    if (this.success) {
      return (
        <div className="Modal-body">
          <div className="Form Form--centered">
            <p className="helpText">{app.translator.trans('core.forum.forgot_password.email_sent_message')}</p>
            <div className="Form-group">
              <Button className="Button Button--primary Button--block" onclick={this.hide.bind(this)}>
                {app.translator.trans('core.forum.forgot_password.dismiss_button')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="Modal-body">
        <div className="Form Form--centered">
          <p className="helpText">{app.translator.trans('core.forum.forgot_password.text')}</p>
          <div className="Form-group">
            <input
              className="FormControl"
              name="email"
              type="email"
              placeholder={extractText(app.translator.trans('core.forum.forgot_password.email_placeholder'))}
              bidi={this.email}
              disabled={this.loading}
            />
          </div>
          <div className="Form-group">
            {Button.component(
              {
                className: 'Button Button--primary Button--block',
                type: 'submit',
                loading: this.loading,
              },
              app.translator.trans('core.forum.forgot_password.submit_button')
            )}
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/forgot',
        body: { email: this.email() },
        errorHandler: this.onerror.bind(this),
      })
      .then(() => {
        this.success = true;
        this.alert = null;
      })
      .catch(() => {})
      .then(this.loaded.bind(this));
  }

  onerror(error) {
    if (error.status === 404) {
      error.alert.content = app.translator.trans('core.forum.forgot_password.not_found_message');
    }

    super.onerror(error);
  }
}
