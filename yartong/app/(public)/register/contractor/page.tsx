import Link from "next/link";

import ContractorRegistrationForm from "@/components/auth/contractor-registration-form";

export default function ContractorRegistrationPage() {
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
              Contractor account
            </span>

            <h1 className="heading-2">
              Build a professional presence for your contracting business.
            </h1>

            <p className="text-lead">
              Present your project capabilities, team, completed work and business performance so customers can evaluate your company before requesting a quotation.
            </p>
          </div>
        </div>

        <ContractorRegistrationForm />
      </div>
    </div>
  );
}