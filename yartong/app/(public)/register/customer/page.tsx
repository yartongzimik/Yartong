import CustomerRegistrationForm from "@/components/auth/customer-registration-form";

export default function CustomerRegistrationPage() {
  return (
    <div className="auth-page">
      <div className="container container--form auth-page__container">
        <div className="auth-page__header">
          <a
            className="back-navigation"
            href="/register"
          >
            ← Choose another account type
          </a>

          <div className="auth-page__heading">
            <span className="eyebrow">
              Customer account
            </span>

            <h1 className="heading-2">
              Create your Yartong account.
            </h1>

            <p className="text-lead">
              Post jobs, contact providers, request quotations and keep your marketplace activity organized in one place.
            </p>
          </div>
        </div>

        <CustomerRegistrationForm />
      </div>
    </div>
  );
}