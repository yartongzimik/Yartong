"use client";

import Link from "next/link";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/* ==========================================================================
   TYPES
   ========================================================================== */

type SkillLevel =
  | "FOUNDATION"
  | "PROFESSIONAL"
  | "SPECIALIST"
  | "MASTER";

interface TradeOption {
  id: string;
  label: string;
}

interface ProviderRegistrationState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  primaryLocation: string;

  primaryTrade: string;
  additionalTrades: string[];

  skillLevel: SkillLevel;

  yearsExperience: string;

  shortBio: string;

  availableForQuickJobs: boolean;
  willingToTravel: boolean;

  acceptTerms: boolean;
  marketingConsent: boolean;
}

interface ProviderFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  primaryLocation?: string;
  primaryTrade?: string;
  skillLevel?: string;
  yearsExperience?: string;
  shortBio?: string;
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

const TRADE_OPTIONS: TradeOption[] = [
  {
    id: "mason",
    label: "Mason",
  },
  {
    id: "carpenter",
    label: "Carpenter",
  },
  {
    id: "electrician",
    label: "Electrician",
  },
  {
    id: "plumber",
    label: "Plumber",
  },
  {
    id: "painter",
    label: "Painter",
  },
  {
    id: "welder",
    label: "Welder",
  },
  {
    id: "roofing",
    label: "Roofing",
  },
  {
    id: "tiles-flooring",
    label: "Tiles & Flooring",
  },
  {
    id: "false-ceiling",
    label: "False Ceiling",
  },
  {
    id: "glass-work",
    label: "Glass Work",
  },
  {
    id: "interior-finishing",
    label: "Interior Finishing",
  },
  {
    id: "other",
    label: "Other",
  },
];

const SKILL_LEVELS: Array<{
  id: SkillLevel;
  name: string;
  description: string;
}> = [
  {
    id: "FOUNDATION",
    name: "Foundation",
    description:
      "Developing practical skills and suitable for basic, supervised or lower-complexity work.",
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    description:
      "Experienced and able to independently handle standard residential and service work.",
  },
  {
    id: "SPECIALIST",
    name: "Specialist",
    description:
      "Advanced expertise in complex work, specialized techniques or higher-value projects.",
  },
  {
    id: "MASTER",
    name: "Master",
    description:
      "Highly experienced professional with deep expertise, leadership capability and an exceptional work record.",
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

function normalizePhone(
  phone: string,
): string {
  return phone.replace(/\s+/g, "");
}

function validateProviderForm(
  values: ProviderRegistrationState,
): ProviderFormErrors {
  const errors: ProviderFormErrors = {};

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

  if (!values.primaryLocation) {
    errors.primaryLocation =
      "Please select your primary location.";
  }

  if (!values.primaryTrade) {
    errors.primaryTrade =
      "Please select your primary trade.";
  }

  if (!values.skillLevel) {
    errors.skillLevel =
      "Please select your current skill level.";
  }

  const yearsExperience =
    Number(values.yearsExperience);

  if (!values.yearsExperience) {
    errors.yearsExperience =
      "Please enter your years of experience.";
  } else if (
    Number.isNaN(yearsExperience) ||
    yearsExperience < 0 ||
    yearsExperience > 60
  ) {
    errors.yearsExperience =
      "Enter a valid number of years between 0 and 60.";
  }

  if (
    values.shortBio.trim().length >
    300
  ) {
    errors.shortBio =
      "Keep your introduction within 300 characters.";
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

export function ProviderRegistrationForm() {
  const router = useRouter();

  const [values, setValues] =
    useState<ProviderRegistrationState>({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      primaryLocation: "senapati-town",

      primaryTrade: "",
      additionalTrades: [],

      skillLevel: "PROFESSIONAL",

      yearsExperience: "",

      shortBio: "",

      availableForQuickJobs: true,
      willingToTravel: false,

      acceptTerms: false,
      marketingConsent: false,
    });

  const [errors, setErrors] =
    useState<ProviderFormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const remainingBioCharacters =
    useMemo(
      () =>
        300 -
        values.shortBio.length,
      [
        values.shortBio.length,
      ],
    );

  function updateField<
    K extends keyof ProviderRegistrationState,
  >(
    key: K,
    value: ProviderRegistrationState[K],
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

  function toggleAdditionalTrade(
    tradeId: string,
  ) {
    setValues((current) => {
      const alreadySelected =
        current.additionalTrades.includes(
          tradeId,
        );

      return {
        ...current,
        additionalTrades:
          alreadySelected
            ? current.additionalTrades.filter(
                (id) =>
                  id !== tradeId,
              )
            : [
                ...current.additionalTrades,
                tradeId,
              ],
      };
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors =
      validateProviderForm(values);

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
       * Backend integration will later:
       *
       * 1. create the user account
       * 2. assign SKILLED_PROVIDER role
       * 3. create provider profile
       * 4. save trade categories
       * 5. save skill level
       * 6. start phone/email verification
       * 7. redirect into provider onboarding
       */

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          700,
        );
      });

      router.push(
        "/register/provider/verify",
      );
    } catch {
      setErrors({
        form:
          "Something went wrong while creating your provider account. Please try again.",
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
              Basic information used to create and secure your Yartong account.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field form-grid__full">
            <label
              className="form-field__label"
              htmlFor="provider-full-name"
            >
              Full name
              <span className="form-field__required">
                *
              </span>
            </label>

            <input
              id="provider-full-name"
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
              htmlFor="provider-email"
            >
              Email address
              <span className="form-field__required">
                *
              </span>
            </label>

            <input
              id="provider-email"
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
              htmlFor="provider-phone"
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
                id="provider-phone"
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
                This number will be verified before your provider profile becomes active.
              </span>
            )}
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="provider-password"
            >
              Password
              <span className="form-field__required">
                *
              </span>
            </label>

            <div className="input-wrapper">
              <input
                id="provider-password"
                className="input input--with-trailing-icon"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                value={values.password}
                aria-invalid={
                  Boolean(
                    errors.password,
                  )
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
              htmlFor="provider-confirm-password"
            >
              Confirm password
              <span className="form-field__required">
                *
              </span>
            </label>

            <input
              id="provider-confirm-password"
              className="input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              value={
                values.confirmPassword
              }
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
              Your trade and experience
            </h2>

            <p className="auth-form-section__description">
              This information helps customers understand what type of work you are suitable for.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="provider-location"
            >
              Primary location
              <span className="form-field__required">
                *
              </span>
            </label>

            <select
              id="provider-location"
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
              htmlFor="provider-primary-trade"
            >
              Primary trade
              <span className="form-field__required">
                *
              </span>
            </label>

            <select
              id="provider-primary-trade"
              className="select"
              value={
                values.primaryTrade
              }
              aria-invalid={
                Boolean(
                  errors.primaryTrade,
                )
              }
              onChange={(event) => {
                updateField(
                  "primaryTrade",
                  event.target.value,
                );
              }}
            >
              <option value="">
                Select your main trade
              </option>

              {TRADE_OPTIONS.map(
                (trade) => (
                  <option
                    key={trade.id}
                    value={trade.id}
                  >
                    {trade.label}
                  </option>
                ),
              )}
            </select>

            {errors.primaryTrade ? (
              <span className="form-message form-message--error">
                {
                  errors.primaryTrade
                }
              </span>
            ) : null}
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="provider-experience"
            >
              Years of experience
              <span className="form-field__required">
                *
              </span>
            </label>

            <input
              id="provider-experience"
              className="input"
              type="number"
              min="0"
              max="60"
              inputMode="numeric"
              value={
                values.yearsExperience
              }
              aria-invalid={
                Boolean(
                  errors.yearsExperience,
                )
              }
              onChange={(event) => {
                updateField(
                  "yearsExperience",
                  event.target.value,
                );
              }}
            />

            {errors.yearsExperience ? (
              <span className="form-message form-message--error">
                {
                  errors.yearsExperience
                }
              </span>
            ) : null}
          </div>

          <div className="form-field">
            <label
              className="form-field__label"
              htmlFor="provider-skill-level"
            >
              Current skill level
              <span className="form-field__required">
                *
              </span>
            </label>

            <select
              id="provider-skill-level"
              className="select"
              value={
                values.skillLevel
              }
              onChange={(event) => {
                updateField(
                  "skillLevel",
                  event.target
                    .value as SkillLevel,
                );
              }}
            >
              {SKILL_LEVELS.map(
                (level) => (
                  <option
                    key={level.id}
                    value={level.id}
                  >
                    {level.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="form-field form-grid__full">
            <span className="form-field__label">
              Skill level guide
            </span>

            <div className="auth-skill-level-guide">
              {SKILL_LEVELS.map(
                (level) => (
                  <button
                    key={level.id}
                    className="auth-skill-level-option"
                    type="button"
                    data-selected={
                      values.skillLevel ===
                      level.id
                    }
                    onClick={() => {
                      updateField(
                        "skillLevel",
                        level.id,
                      );
                    }}
                  >
                    <strong>
                      {level.name}
                    </strong>

                    <span>
                      {
                        level.description
                      }
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="form-field form-grid__full">
            <span className="form-field__label">
              Additional trades
            </span>

            <p className="form-field__help">
              Select any other trades you can genuinely provide. You can add detailed skills during onboarding.
            </p>

            <div className="auth-trade-selector">
              {TRADE_OPTIONS.filter(
                (trade) =>
                  trade.id !==
                  values.primaryTrade,
              ).map((trade) => {
                const isSelected =
                  values.additionalTrades.includes(
                    trade.id,
                  );

                return (
                  <button
                    key={trade.id}
                    className="auth-trade-selector__option"
                    type="button"
                    data-selected={
                      isSelected
                    }
                    onClick={() => {
                      toggleAdditionalTrade(
                        trade.id,
                      );
                    }}
                  >
                    {trade.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-field form-grid__full">
            <div className="form-field__header">
              <label
                className="form-field__label"
                htmlFor="provider-bio"
              >
                Short professional introduction
              </label>

              <span className="form-field__counter">
                {remainingBioCharacters}
              </span>
            </div>

            <textarea
              id="provider-bio"
              className="textarea"
              rows={4}
              maxLength={300}
              value={values.shortBio}
              placeholder="Example: Residential electrician with 6 years of experience in wiring, installation and household electrical repairs."
              onChange={(event) => {
                updateField(
                  "shortBio",
                  event.target.value,
                );
              }}
            />

            {errors.shortBio ? (
              <span className="form-message form-message--error">
                {errors.shortBio}
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
              Work preferences
            </h2>

            <p className="auth-form-section__description">
              These settings help Yartong show you more relevant opportunities.
            </p>
          </div>
        </div>

        <div className="auth-form__consents">
          <label className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              checked={
                values.availableForQuickJobs
              }
              onChange={(event) => {
                updateField(
                  "availableForQuickJobs",
                  event.target.checked,
                );
              }}
            />

            <span className="checkbox__control" />

            <span>
              I am interested in suitable Quick Jobs and short-duration work.
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
              I may be willing to travel outside my primary location for suitable work.
            </span>
          </label>
        </div>
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
              Send me occasional Yartong marketplace and business-growth updates.
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
          data-loading={
            isSubmitting
          }
        >
          {isSubmitting ? (
            <span className="button__spinner" />
          ) : null}

          <span className="button__label">
            Create provider account
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

export default ProviderRegistrationForm;