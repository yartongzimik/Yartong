"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/* ==========================================================================
   TYPES
   ========================================================================== */

interface CustomerRegistrationState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: string;
  acceptTerms: boolean;
  marketingConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
  acceptTerms?: string;
  form?: string;
}

/* ==========================================================================
   DATA
   ========================================================================== */

const LOCATIONS = [
  {
    value: "senapati-town",
    label: "Senapati Town",
  },
  {
    value: "mao",
    label: "Mao",
  },
  {
    value: "paomata",
    label: "Paomata",
  },
  {
    value: "purul",
    label: "Purul",
  },
] as const;

/* ==========================================================================
   HELPERS
   ========================================================================== */

function normalizePhone(
  phone: string,
): string {
  return phone.replace(/\s+/g, "");
}

function validateForm(
  values: CustomerRegistrationState,
): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName =
      "Please enter your full name.";
  }

  if (!values.email.trim()) {
    errors.email =
      "Please enter your email address.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      values.email,
    )
  ) {
    errors.email =
      "Enter a valid email address.";
  }

  const normalizedPhone =
    normalizePhone(values.phone);

  if (!normalizedPhone) {
    errors.phone =
      "Please enter your phone number.";
  } else if (
    !/^[6-9]\d{9}$/.test(
      normalizedPhone,
    )
  ) {
    errors.phone =
      "Enter a valid 10-digit Indian mobile number.";
  }

  if (!values.password) {
    errors.password =
      "Please create a password.";
  } else if (
    values.password.length < 8
  ) {
    errors.password =
      "Password must be at least 8 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword =
      "Please confirm your password.";
  } else if (
    values.confirmPassword !==
    values.password
  ) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  if (!values.location) {
    errors.location =
      "Please select your location.";
  }

  if (!values.acceptTerms) {
    errors.acceptTerms =
      "You must accept the Terms and Privacy Policy.";
  }

  return errors;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function CustomerRegistrationForm() {
  const router = useRouter();

  const [values, setValues] =
    useState<CustomerRegistrationState>({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      location: "senapati-town",
      acceptTerms: false,
      marketingConsent: false,
    });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  function updateField<
    K extends keyof CustomerRegistrationState,
  >(
    key: K,
    value: CustomerRegistrationState[K],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
      form: undefined,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors =
      validateForm(values);

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Backend integration comes later.
       *
       * For now we only simulate the flow.
       * When the API is connected, this is
       * where we will:
       *
       * 1. create the account
       * 2. create the CUSTOMER role profile
       * 3. send phone/email verification
       * 4. establish the authenticated session
       * 5. redirect into onboarding/dashboard
       */

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          700,
        );
      });

      router.push(
        "/register/customer/verify",
      );
    } catch {
      setErrors({
        form:
          "Something went wrong while creating your account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="form auth-form"
      noValidate
      onSubmit={handleSubmit}
    >
      {errors.form ? (
        <div
          className="form-message form-message--error"
          role="alert"
        >
          {errors.form}
        </div>
      ) : null}

      <div className="form-grid">
        <div className="form-field form-grid__full">
          <label
            className="form-field__label"
            htmlFor="customer-full-name"
          >
            Full name
            <span className="form-field__required">
              *
            </span>
          </label>

          <input
            id="customer-full-name"
            className="input"
            type="text"
            autoComplete="name"
            value={values.fullName}
            aria-invalid={
              Boolean(errors.fullName)
            }
            onChange={(event) => {
              updateField(
                "fullName",
                event.target.value,
              );
            }}
          />

          {errors.fullName ? (
            <span className="form-message form-message--error">
              {errors.fullName}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label
            className="form-field__label"
            htmlFor="customer-email"
          >
            Email address
            <span className="form-field__required">
              *
            </span>
          </label>

          <input
            id="customer-email"
            className="input"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            aria-invalid={
              Boolean(errors.email)
            }
            onChange={(event) => {
              updateField(
                "email",
                event.target.value,
              );
            }}
          />

          {errors.email ? (
            <span className="form-message form-message--error">
              {errors.email}
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label
            className="form-field__label"
            htmlFor="customer-phone"
          >
            Mobile number
            <span className="form-field__required">
              *
            </span>
          </label>

          <div className="auth-phone-field">
            <span className="auth-phone-field__prefix">
              +91
            </span>

            <input
              id="customer-phone"
              className="input auth-phone-field__input"
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              value={values.phone}
              aria-invalid={
                Boolean(errors.phone)
              }
              onChange={(event) => {
                const digits =
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                updateField(
                  "phone",
                  digits,
                );
              }}
            />
          </div>

          {errors.phone ? (
            <span className="form-message form-message--error">
              {errors.phone}
            </span>
          ) : (
            <span className="form-field__help">
              We will verify this number before activating your account.
            </span>
          )}
        </div>

        <div className="form-field">
          <label
            className="form-field__label"
            htmlFor="customer-location"
          >
            Primary location
            <span className="form-field__required">
              *
            </span>
          </label>

          <select
            id="customer-location"
            className="select"
            value={values.location}
            aria-invalid={
              Boolean(errors.location)
            }
            onChange={(event) => {
              updateField(
                "location",
                event.target.value,
              );
            }}
          >
            {LOCATIONS.map(
              (location) => (
                <option
                  key={location.value}
                  value={location.value}
                >
                  {location.label}
                </option>
              ),
            )}
          </select>

          {errors.location ? (
            <span className="form-message form-message--error">
              {errors.location}
            </span>
          ) : (
            <span className="form-field__help">
              You can change this later and add additional service locations.
            </span>
          )}
        </div>

        <div className="form-field">
          <div className="form-field__header">
            <label
              className="form-field__label"
              htmlFor="customer-password"
            >
              Password
              <span className="form-field__required">
                *
              </span>
            </label>
          </div>

          <div className="input-wrapper">
            <input
              id="customer-password"
              className="input input--with-trailing-icon"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              value={values.password}
              aria-invalid={
                Boolean(errors.password)
              }
              onChange={(event) => {
                updateField(
                  "password",
                  event.target.value,
                );
              }}
            />

            <button
              className="input-wrapper__action"
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() => {
                setShowPassword(
                  (current) =>
                    !current,
                );
              }}
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {errors.password ? (
            <span className="form-message form-message--error">
              {errors.password}
            </span>
          ) : (
            <span className="form-field__help">
              Use at least 8 characters.
            </span>
          )}
        </div>

        <div className="form-field">
          <label
            className="form-field__label"
            htmlFor="customer-confirm-password"
          >
            Confirm password
            <span className="form-field__required">
              *
            </span>
          </label>

          <input
            id="customer-confirm-password"
            className="input"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            value={values.confirmPassword}
            aria-invalid={
              Boolean(
                errors.confirmPassword,
              )
            }
            onChange={(event) => {
              updateField(
                "confirmPassword",
                event.target.value,
              );
            }}
          />

          {errors.confirmPassword ? (
            <span className="form-message form-message--error">
              {errors.confirmPassword}
            </span>
          ) : null}
        </div>
      </div>

      <div className="auth-form__consents">
        <label className="checkbox">
          <input
            className="checkbox__input"
            type="checkbox"
            checked={values.acceptTerms}
            onChange={(event) => {
              updateField(
                "acceptTerms",
                event.target.checked,
              );
            }}
          />

          <span className="checkbox__control" />

          <span>
            I agree to the{" "}
            <Link
              className="text-link"
              href="/terms"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="text-link"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {errors.acceptTerms ? (
          <span className="form-message form-message--error">
            {errors.acceptTerms}
          </span>
        ) : null}

        <label className="checkbox">
          <input
            className="checkbox__input"
            type="checkbox"
            checked={
              values.marketingConsent
            }
            onChange={(event) => {
              updateField(
                "marketingConsent",
                event.target.checked,
              );
            }}
          />

          <span className="checkbox__control" />

          <span>
            Send me occasional Yartong updates, marketplace tips and new feature announcements.
          </span>
        </label>
      </div>

      <div className="form-actions form-actions--between">
        <Link
          className="button button--ghost"
          href="/register"
        >
          Back
        </Link>

        <button
          className="button button--primary"
          type="submit"
          disabled={isSubmitting}
          data-loading={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button__spinner" />
          ) : null}

          <span className="button__label">
            Create customer account
          </span>
        </button>
      </div>

      <p className="auth-form__login">
        Already have an account?{" "}
        <Link
          className="text-link"
          href="/login"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default CustomerRegistrationForm;