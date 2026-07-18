import Link from "next/link";

import RoleSelector from "@/components/auth/role-selector";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="container auth-page__container">
        <div className="auth-page__header">
          <Link
            className="back-navigation"
            href="/"
          >
            ← Back to Yartong
          </Link>

          <div className="auth-page__heading">
            <span className="eyebrow">
              Join Yartong
            </span>

            <h1 className="heading-2">
              Choose how you will use Yartong.
            </h1>

            <p className="text-lead">
              Select the account type that best
              describes you. Your dashboard,
              onboarding and marketplace tools will
              be tailored to your role.
            </p>
          </div>
        </div>

        <RoleSelector />
      </div>
    </div>
  );
}