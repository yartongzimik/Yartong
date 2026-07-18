import Link from "next/link";

import LabourerRegistrationForm from "@/components/auth/labourer-registration-form";

export default function LabourerRegistrationPage() {
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
              Labourer account
            </span>

            <h1 className="heading-2">
              Find work and build a professional work record.
            </h1>

            <p className="text-lead">
              Register for daily-wage, short-term, part-time, full-time and contract opportunities. Your work history and performance profile can grow as you complete jobs through Yartong.
            </p>
          </div>
        </div>

        <LabourerRegistrationForm />
      </div>
    </div>
  );
}