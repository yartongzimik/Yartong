"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type WorkPreference =
  | "FULL_TIME"
  | "PART_TIME"
  | "DAILY"
  | "CONTRACT";

interface LabourerRegistrationState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  primaryLocation: string;
  workPreference: WorkPreference;

  workCategories: string[];

  expectedDailyRate: string;
  willingToTravel: boolean;
  availableImmediately: boolean;

  acceptTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  primaryLocation?: string;
  workCategories?: string;
  expectedDailyRate?: string;
  acceptTerms?: string;
  form?: string;
}

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

const WORK_CATEGORIES = [
  "General construction",
  "Loading & unloading",
  "Masonry support",
  "Carpentry support",
  "Painting support",
  "Road work",
  "Excavation",
  "Material handling",
  "Site cleaning",
  "Other",
];

function validateForm(
  values: LabourerRegistrationState,
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

  if (
    !/^[6-9]\d{9}$/.test(
      values.phone,
    )
  ) {
    errors.phone =
      "Enter a valid 10-digit Indian mobile number.";
  }

  if (values.password.length < 8) {
    errors.password =
      "Password must be at least 8 characters.";
  }

  if (
    values.confirmPassword !==
    values.password
  ) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  if (!values.primaryLocation) {
    errors.primaryLocation =
      "Please select your location.";
  }

  if (
    values.workCategories.length === 0
  ) {
    errors.workCategories =
      "Select at least one type of work.";
  }

  if (
    values.expectedDailyRate &&
    Number(values.expectedDailyRate) < 0
  ) {
    errors.expectedDailyRate =
      "Enter a valid daily rate.";
  }

  if (!values.acceptTerms) {
    errors.acceptTerms =
      "You must accept the Terms and Privacy Policy.";
  }

  return errors;
}

export default function LabourerRegistrationForm() {
  const router = useRouter();

  const [values, setValues] =
    useState<LabourerRegistrationState>({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      primaryLocation: "senapati-town",
      workPreference: "DAILY",

      workCategories: [],

      expectedDailyRate: "",
      willingToTravel: false,
      availableImmediately: true,

      acceptTerms: false,
    });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  function updateField<
    K extends keyof LabourerRegistrationState,
  >(
    key: K,
    value: LabourerRegistrationState[K],
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

  function toggleCategory(
    category: string,
  ) {
    setValues((current) => ({
      ...current,
      workCategories:
        current.workCategories.includes(
          category,
        )
          ? current.workCategories.filter(
              (item) =>
                item !== category,
            )
          : [
              ...current.workCategories,
              category,
            ],
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
       * Backend integration later:
       *
       * - Create account
       * - Assign LABOURER role
       * - Create managed labourer profile
       * - Save availability and work preferences
       * - Begin verification
       * - Redirect to labourer onboarding
       */

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          700,
        );
      });

      router.push(
        "/register/labourer/verify",
      );
    } catch {
      setErrors({
        form:
          "Something went wrong while creating your labourer account.",
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

      <section className="auth-form-section">
        <div className="auth-form-section__header">
          <span className="auth-form-section__step">
            01
          </span>

          <div>
            <h2 className="auth-form-section__title">
              Account details
            </h2>

            <p className="auth-form-section__description">
              Create your Yartong labourer account.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field form-grid__full">
            <label
              className="form-field__label"
              htmlFor="labourer-full-name"
            >
              Full name *
            </label>

            <input
              id="labourer-full-name"
              className="input"
              type="text"
              value={values.fullName}
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
              htmlFor="labourer-email"
            >
              Email address *
            </label>

            <input
              id="labourer-email"
              className="input"
              type="email"
              value={values.email}
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
              htmlFor="labourer-phone"
            >
              Mobile number *
            </label>

            <div className="auth-phone-field">
              <span className="auth-phone-field__prefix">
                +91
              </span>

              <input
                id="labourer-phone"
                className="input auth-phone-field__input"
                type="tel"
                maxLength={10}
                inputMode="numeric"
                value={values.phone}
                onChange={(event) => {
                  updateField(
                    "phone",
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  );
                }}
              />
            </div>

            {errors.phone ? (
              <span className="form-message form-message--error">
                {errors.phone}
              </span>
            ) : null}
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="labourer-password"
            >
              Password *
            </label>

            <div className="input-wrapper">
              <input
                id="labourer-password"
                className="input input--with-trailing-icon"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={values.password}
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
            ) : null}
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="labourer-confirm-password"
            >
              Confirm password *
            </label>

            <input
              id="labourer-confirm-password"
              className="input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={
                values.confirmPassword
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
                {
                  errors.confirmPassword
                }
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-section__header">
          <span className="auth-form-section__step">
            02
          </span>

          <div>
            <h2 className="auth-form-section__title">
              Work preferences
            </h2>

            <p className="auth-form-section__description">
              Tell us what kind of work you are looking for.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="labourer-location"
            >
              Primary location *
            </label>

            <select
              id="labourer-location"
              className="select"
              value={
                values.primaryLocation
              }
              onChange={(event) => {
                updateField(
                  "primaryLocation",
                  event.target.value,
                );
              }}
            >
              {LOCATIONS.map(
                (location) => (
                  <option
                    key={
                      location.value
                    }
                    value={
                      location.value
                    }
                  >
                    {location.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="labourer-work-preference"
            >
              Preferred work type
            </label>

            <select
              id="labourer-work-preference"
              className="select"
              value={
                values.workPreference
              }
              onChange={(event) => {
                updateField(
                  "workPreference",
                  event.target
                    .value as WorkPreference,
                );
              }}
            >
              <option value="DAILY">
                Daily-wage work
              </option>

              <option value="PART_TIME">
                Part-time work
              </option>

              <option value="FULL_TIME">
                Full-time work
              </option>

              <option value="CONTRACT">
                Contract work
              </option>
            </select>
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="labourer-rate"
            >
              Expected daily rate
            </label>

            <input
              id="labourer-rate"
              className="input"
              type="number"
              min="0"
              placeholder="₹"
              value={
                values.expectedDailyRate
              }
              onChange={(event) => {
                updateField(
                  "expectedDailyRate",
                  event.target.value,
                );
              }}
            />

            {errors.expectedDailyRate ? (
              <span className="form-message form-message--error">
                {
                  errors.expectedDailyRate
                }
              </span>
            ) : (
              <span className="form-field__help">
                This is only your preferred rate and can vary by job.
              </span>
            )}
          </div>

          <div className="form-field form-grid__full">
            <span className="form-field__label">
              Types of work you can do *
            </span>

            <div className="auth-trade-selector">
              {WORK_CATEGORIES.map(
                (category) => {
                  const isSelected =
                    values.workCategories.includes(
                      category,
                    );

                  return (
                    <button
                      key={category}
                      className="auth-trade-selector__option"
                      type="button"
                      data-selected={
                        isSelected
                      }
                      onClick={() => {
                        toggleCategory(
                          category,
                        );
                      }}
                    >
                      {category}
                    </button>
                  );
                },
              )}
            </div>

            {errors.workCategories ? (
              <span className="form-message form-message--error">
                {
                  errors.workCategories
                }
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-section__header">
          <span className="auth-form-section__step">
            03
          </span>

          <div>
            <h2 className="auth-form-section__title">
              Availability
            </h2>

            <p className="auth-form-section__description">
              These settings help Yartong match you with suitable work.
            </p>
          </div>
        </div>

        <div className="auth-form__consents">
          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.availableImmediately
              }
              onChange={(event) => {
                updateField(
                  "availableImmediately",
                  event.target.checked,
                );
              }}
            />

            <span className="checkbox__control" />

            <span>
              I am currently available for work.
            </span>
          </label>

          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.willingToTravel
              }
              onChange={(event) => {
                updateField(
                  "willingToTravel",
                  event.target.checked,
                );
              }}
            />

            <span className="checkbox__control" />

            <span>
              I may travel outside my primary location for suitable work.
            </span>
          </label>
        </div>
      </section>

      <section className="labourer-management-note">
        <strong>
          Yartong-managed labourer profiles
        </strong>

        <p>
          Labourer accounts will include structured work history, attendance and reliability signals, job completion records, ratings and professional performance evaluation. These records will be managed carefully by Yartong to help build a fair and useful reputation system.
        </p>
      </section>

      <section className="auth-form-section">
        <div className="auth-form__consents">
          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.acceptTerms
              }
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
        </div>
      </section>

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
        >
          {isSubmitting ? (
            <span className="button__spinner" />
          ) : null}

          Create labourer account
        </button>
      </div>
    </form>
  );
}