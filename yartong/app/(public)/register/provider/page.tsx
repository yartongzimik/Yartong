import Link from "next/link";

import ProviderRegistrationForm from "@/components/auth/provider-registration-form";

export default function ProviderRegistrationPage() {
  return (
    <div className="auth-page">
      <div className="container container--form-wide auth-page__container">
        <div className="auth-page__header">
          <Link
            className="back-navigation"
            href="/register"
          >
            ← Choose another account type
          </Link>

          <div className="auth-page__heading">
            <span className="eyebrow">
              Skilled Provider account
            </span>

            <h1 className="heading-2">
              Build a professional profile around your skills.
            </h1>

            <p className="text-lead">
              Tell Yartong what you do, where you work and your current experience level. Portfolio, pricing, detailed skills, availability and verification will be completed during onboarding.
            </p>
          </div>
        </div>

        <ProviderRegistrationForm />
      </div>
    </div>
  );
}