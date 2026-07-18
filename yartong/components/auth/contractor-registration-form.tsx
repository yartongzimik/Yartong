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

type ContractorType =
  | "INDIVIDUAL"
  | "BUSINESS";

type TeamSize =
  | "SOLO"
  | "2_5"
  | "6_10"
  | "11_20"
  | "21_PLUS";

interface ContractorRegistrationState {
  fullName: string;
  businessName: string;
  contractorType: ContractorType;

  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  primaryLocation: string;
  serviceLocations: string[];

  yearsInBusiness: string;
  teamSize: TeamSize;

  projectCategories: string[];

  acceptsResidential: boolean;
  acceptsCommercial: boolean;
  acceptsGovernment: boolean;

  shortDescription: string;

  acceptTerms: boolean;
  marketingConsent: boolean;
}

interface ContractorFormErrors {
  fullName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  primaryLocation?: string;
  yearsInBusiness?: string;
  projectCategories?: string;
  shortDescription?: string;
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

const PROJECT_CATEGORIES = [
  "Residential Construction",
  "Commercial Construction",
  "Renovation",
  "Road Construction",
  "Retaining Walls",
  "Drainage",
  "Schools & Institutional",
  "Structural Repair",
  "Interior Projects",
  "Other",
];

const TEAM_SIZE_OPTIONS: Array<{
  value: TeamSize;
  label: string;
}> = [
  {
    value: "SOLO",
    label: "Independent contractor",
  },
  {
    value: "2_5",
    label: "2–5 team members",
  },
  {
    value: "6_10",
    label: "6–10 team members",
  },
  {
    value: "11_20",
    label: "11–20 team members",
  },
  {
    value: "21_PLUS",
    label: "21+ team members",
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

function validateForm(
  values: ContractorRegistrationState,
): ContractorFormErrors {
  const errors: ContractorFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName =
      "Please enter your full name.";
  }

  if (
    values.contractorType === "BUSINESS" &&
    !values.businessName.trim()
  ) {
    errors.businessName =
      "Please enter your business name.";
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
    values.password !==
    values.confirmPassword
  ) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  if (!values.primaryLocation) {
    errors.primaryLocation =
      "Please select your primary location.";
  }

  if (!values.yearsInBusiness) {
    errors.yearsInBusiness =
      "Please enter years in business.";
  } else if (
    Number(values.yearsInBusiness) < 0 ||
    Number(values.yearsInBusiness) > 80
  ) {
    errors.yearsInBusiness =
      "Enter a valid number of years.";
  }

  if (
    values.projectCategories.length === 0
  ) {
    errors.projectCategories =
      "Select at least one project category.";
  }

  if (
    values.shortDescription.length >
    400
  ) {
    errors.shortDescription =
      "Keep your business description within 400 characters.";
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

export default function ContractorRegistrationForm() {
  const router = useRouter();

  const [values, setValues] =
    useState<ContractorRegistrationState>({
      fullName: "",
      businessName: "",
      contractorType: "BUSINESS",

      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      primaryLocation: "senapati-town",
      serviceLocations: [],

      yearsInBusiness: "",
      teamSize: "2_5",

      projectCategories: [],

      acceptsResidential: true,
      acceptsCommercial: false,
      acceptsGovernment: false,

      shortDescription: "",

      acceptTerms: false,
      marketingConsent: false,
    });

  const [errors, setErrors] =
    useState<ContractorFormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  function updateField<
    K extends keyof ContractorRegistrationState,
  >(
    key: K,
    value: ContractorRegistrationState[K],
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

  function toggleProjectCategory(
    category: string,
  ) {
    setValues((current) => ({
      ...current,
      projectCategories:
        current.projectCategories.includes(
          category,
        )
          ? current.projectCategories.filter(
              (item) =>
                item !== category,
            )
          : [
              ...current.projectCategories,
              category,
            ],
    }));
  }

  function toggleServiceLocation(
    location: string,
  ) {
    setValues((current) => ({
      ...current,
      serviceLocations:
        current.serviceLocations.includes(
          location,
        )
          ? current.serviceLocations.filter(
              (item) =>
                item !== location,
            )
          : [
              ...current.serviceLocations,
              location,
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
       * - Assign CONTRACTOR role
       * - Create contractor business profile
       * - Save project categories
       * - Save team and service coverage
       * - Start verification
       * - Redirect to contractor onboarding
       */

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          700,
        );
      });

      router.push(
        "/register/contractor/verify",
      );
    } catch {
      setErrors({
        form:
          "Something went wrong while creating your contractor account.",
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
              Contractor identity
            </h2>

            <p className="auth-form-section__description">
              Tell us whether you operate independently or as a registered business.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="contractor-type"
            >
              Contractor type
            </label>

            <select
              id="contractor-type"
              className="select"
              value={values.contractorType}
              onChange={(event) => {
                updateField(
                  "contractorType",
                  event.target
                    .value as ContractorType,
                );
              }}
            >
              <option value="BUSINESS">
                Business / Company
              </option>

              <option value="INDIVIDUAL">
                Independent Contractor
              </option>
            </select>
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="contractor-full-name"
            >
              Your full name *
            </label>

            <input
              id="contractor-full-name"
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

          {values.contractorType ===
          "BUSINESS" ? (
            <div className="form-field form-grid__full">
              <label
                className="form-field__label"
                htmlFor="contractor-business-name"
              >
                Business name *
              </label>

              <input
                id="contractor-business-name"
                className="input"
                type="text"
                value={values.businessName}
                onChange={(event) => {
                  updateField(
                    "businessName",
                    event.target.value,
                  );
                }}
              />

              {errors.businessName ? (
                <span className="form-message form-message--error">
                  {errors.businessName}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-section__header">
          <span className="auth-form-section__step">
            02
          </span>

          <div>
            <h2 className="auth-form-section__title">
              Account details
            </h2>

            <p className="auth-form-section__description">
              Create secure login credentials for your contractor account.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="contractor-email"
            >
              Email address *
            </label>

            <input
              id="contractor-email"
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
              htmlFor="contractor-phone"
            >
              Mobile number *
            </label>

            <div className="auth-phone-field">
              <span className="auth-phone-field__prefix">
                +91
              </span>

              <input
                id="contractor-phone"
                className="input auth-phone-field__input"
                type="tel"
                maxLength={10}
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
              htmlFor="contractor-password"
            >
              Password *
            </label>

            <div className="input-wrapper">
              <input
                id="contractor-password"
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
              htmlFor="contractor-confirm-password"
            >
              Confirm password *
            </label>

            <input
              id="contractor-confirm-password"
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
            03
          </span>

          <div>
            <h2 className="auth-form-section__title">
              Business profile
            </h2>

            <p className="auth-form-section__description">
              This information helps customers understand the size and scope of your operation.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="contractor-location"
            >
              Primary location *
            </label>

            <select
              id="contractor-location"
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
              htmlFor="contractor-years"
            >
              Years in business *
            </label>

            <input
              id="contractor-years"
              className="input"
              type="number"
              min="0"
              max="80"
              value={
                values.yearsInBusiness
              }
              onChange={(event) => {
                updateField(
                  "yearsInBusiness",
                  event.target.value,
                );
              }}
            />

            {errors.yearsInBusiness ? (
              <span className="form-message form-message--error">
                {errors.yearsInBusiness}
              </span>
            ) : null}
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="contractor-team-size"
            >
              Team size
            </label>

            <select
              id="contractor-team-size"
              className="select"
              value={values.teamSize}
              onChange={(event) => {
                updateField(
                  "teamSize",
                  event.target
                    .value as TeamSize,
                );
              }}
            >
              {TEAM_SIZE_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="form-field form-grid__full">
            <span className="form-field__label">
              Additional service locations
            </span>

            <div className="auth-trade-selector">
              {LOCATIONS.filter(
                (location) =>
                  location.value !==
                  values.primaryLocation,
              ).map(
                (location) => (
                  <button
                    key={location.value}
                    className="auth-trade-selector__option"
                    type="button"
                    data-selected={
                      values.serviceLocations.includes(
                        location.value,
                      )
                    }
                    onClick={() => {
                      toggleServiceLocation(
                        location.value,
                      );
                    }}
                  >
                    {location.label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="form-field form-grid__full">
            <span className="form-field__label">
              Project categories *
            </span>

            <div className="auth-trade-selector">
              {PROJECT_CATEGORIES.map(
                (category) => (
                  <button
                    key={category}
                    className="auth-trade-selector__option"
                    type="button"
                    data-selected={
                      values.projectCategories.includes(
                        category,
                      )
                    }
                    onClick={() => {
                      toggleProjectCategory(
                        category,
                      );
                    }}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>

            {errors.projectCategories ? (
              <span className="form-message form-message--error">
                {
                  errors.projectCategories
                }
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-section__header">
          <span className="auth-form-section__step">
            04
          </span>

          <div>
            <h2 className="auth-form-section__title">
              Project preferences
            </h2>

            <p className="auth-form-section__description">
              Choose the types of project opportunities your business is interested in.
            </p>
          </div>
        </div>

        <div className="auth-form__consents">
          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.acceptsResidential
              }
              onChange={(event) => {
                updateField(
                  "acceptsResidential",
                  event.target.checked,
                );
              }}
            />

            <span className="checkbox__control" />

            <span>
              Residential project enquiries
            </span>
          </label>

          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.acceptsCommercial
              }
              onChange={(event) => {
                updateField(
                  "acceptsCommercial",
                  event.target.checked,
                );
              }}
            />

            <span className="checkbox__control" />

            <span>
              Commercial project enquiries
            </span>
          </label>

          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.acceptsGovernment
              }
              onChange={(event) => {
                updateField(
                  "acceptsGovernment",
                  event.target.checked,
                );
              }}
            />

            <span className="checkbox__control" />

            <span>
              Government and institutional project opportunities
            </span>
          </label>
        </div>

        <div className="form-field">
          <label
            className="form-field__label"
            htmlFor="contractor-description"
          >
            Short business description
          </label>

          <textarea
            id="contractor-description"
            className="textarea"
            rows={5}
            maxLength={400}
            value={
              values.shortDescription
            }
            placeholder="Describe your company, experience, team and the types of projects you normally undertake."
            onChange={(event) => {
              updateField(
                "shortDescription",
                event.target.value,
              );
            }}
          />

          {errors.shortDescription ? (
            <span className="form-message form-message--error">
              {
                errors.shortDescription
              }
            </span>
          ) : null}
        </div>
      </section>

      <section className="contractor-profile-note">
        <strong>
          Your contractor business page
        </strong>

        <p>
          After registration, you will be able to add completed projects, project photos, certifications, team information, service coverage, business documents, customer reviews and quotation preferences. Your dashboard will also track enquiries, profile visits, response performance and business growth.
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
              Send me occasional Yartong business and marketplace updates.
            </span>
          </label>
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

          Create contractor account
        </button>
      </div>
    </form>
  );
}