"use client";

import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/* ==========================================================================
   TYPES
   ========================================================================== */

type SearchCategory =
  | "ALL"
  | "WORKER"
  | "CONTRACTOR"
  | "LABOURER"
  | "MATERIAL"
  | "SUPPLIER"
  | "QUICK_JOB";

interface SearchSuggestion {
  id: string;
  label: string;
  description: string;
  category: SearchCategory;
  searchValue: string;
}

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

/* ==========================================================================
   DATA
   This temporary local discovery data will later come from the search API.
   ========================================================================== */

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: "suggestion-mason",
    label: "Mason",
    description: "Brickwork, plastering and concrete work",
    category: "WORKER",
    searchValue: "mason",
  },
  {
    id: "suggestion-carpenter",
    label: "Carpenter",
    description: "Furniture, doors, windows and roofing woodwork",
    category: "WORKER",
    searchValue: "carpenter",
  },
  {
    id: "suggestion-electrician",
    label: "Electrician",
    description: "Electrical installation, wiring and repairs",
    category: "WORKER",
    searchValue: "electrician",
  },
  {
    id: "suggestion-plumber",
    label: "Plumber",
    description: "Pipe installation, leakage repairs and drainage",
    category: "WORKER",
    searchValue: "plumber",
  },
  {
    id: "suggestion-contractor",
    label: "Construction contractor",
    description: "Residential construction and renovation teams",
    category: "CONTRACTOR",
    searchValue: "construction contractor",
  },
  {
    id: "suggestion-labourer",
    label: "Construction labourer",
    description: "Daily-wage and contract labour support",
    category: "LABOURER",
    searchValue: "construction labourer",
  },
  {
    id: "suggestion-cement",
    label: "Cement",
    description: "Compare nearby suppliers and request quotations",
    category: "MATERIAL",
    searchValue: "cement",
  },
  {
    id: "suggestion-steel",
    label: "Steel and rebar",
    description: "TMT bars, structural steel and reinforcement",
    category: "MATERIAL",
    searchValue: "steel and rebar",
  },
  {
    id: "suggestion-supplier",
    label: "Material supplier",
    description: "Construction-material shops and wholesalers",
    category: "SUPPLIER",
    searchValue: "material supplier",
  },
  {
    id: "suggestion-quick-job",
    label: "Quick Jobs",
    description: "Small or urgent jobs requiring fast assistance",
    category: "QUICK_JOB",
    searchValue: "quick jobs",
  },
];

const POPULAR_SEARCHES = [
  "Contractors",
  "Plumbers",
  "Electricians",
  "Building materials",
];

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
   ICONS
   ========================================================================== */

function SearchIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ArrowRightIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ShieldCheckIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v5c0 4.8 2.9 8.1 7 10 4.1-1.9 7-5.2 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MessageIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 18.5 3.5 21l3.8-.9A9 9 0 1 0 5 18.5Z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function ChartIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  );
}

function BriefcaseIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function WorkerIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

function MaterialIcon({
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </svg>
  );
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getSearchRoute(
  query: string,
  location: string,
  category: SearchCategory = "ALL",
): string {
  const params = new URLSearchParams();

  params.set("q", query.trim());
  params.set("location", location);

  if (category !== "ALL") {
    params.set("type", category.toLowerCase());
  }

  switch (category) {
    case "MATERIAL":
      return `/materials?${params.toString()}`;

    case "SUPPLIER":
      return `/materials?${params.toString()}`;

    case "QUICK_JOB":
      return `/quick-jobs?${params.toString()}`;

    case "CONTRACTOR":
      return `/contractor?${params.toString()}`;

    case "LABOURER":
      return `/workers?${params.toString()}`;

    case "WORKER":
    case "ALL":
    default:
      return `/workers?${params.toString()}`;
  }
}

function getSuggestionIcon(
  category: SearchCategory,
) {
  switch (category) {
    case "MATERIAL":
    case "SUPPLIER":
      return MaterialIcon;

    case "QUICK_JOB":
      return BriefcaseIcon;

    default:
      return WorkerIcon;
  }
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function Hero() {
  const router = useRouter();

  const inputId = useId();
  const locationId = useId();
  const listboxId = useId();

  const searchContainerRef =
    useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [location, setLocation] =
    useState("senapati-town");

  const [isSuggestionsOpen, setIsSuggestionsOpen] =
    useState(false);

  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState(-1);

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return SEARCH_SUGGESTIONS.slice(0, 6);
    }

    return SEARCH_SUGGESTIONS.filter(
      (suggestion) =>
        suggestion.label
          .toLowerCase()
          .includes(normalizedQuery) ||
        suggestion.description
          .toLowerCase()
          .includes(normalizedQuery) ||
        suggestion.searchValue
          .toLowerCase()
          .includes(normalizedQuery),
    ).slice(0, 7);
  }, [query]);

  useEffect(() => {
    function handlePointerDown(
      event: PointerEvent,
    ) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsSuggestionsOpen(false);
        setActiveSuggestionIndex(-1);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, []);

  function submitSearch(
    searchQuery: string,
    category: SearchCategory = "ALL",
  ) {
    const cleanedQuery = searchQuery.trim();

    if (!cleanedQuery) {
      setIsSuggestionsOpen(true);
      return;
    }

    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);

    router.push(
      getSearchRoute(
        cleanedQuery,
        location,
        category,
      ),
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    submitSearch(query);
  }

  function handleSuggestionSelect(
    suggestion: SearchSuggestion,
  ) {
    setQuery(suggestion.searchValue);

    submitSearch(
      suggestion.searchValue,
      suggestion.category,
    );
  }

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === "ArrowDown" &&
      filteredSuggestions.length > 0
    ) {
      event.preventDefault();

      setIsSuggestionsOpen(true);

      setActiveSuggestionIndex(
        (currentIndex) =>
          currentIndex >=
          filteredSuggestions.length - 1
            ? 0
            : currentIndex + 1,
      );

      return;
    }

    if (
      event.key === "ArrowUp" &&
      filteredSuggestions.length > 0
    ) {
      event.preventDefault();

      setIsSuggestionsOpen(true);

      setActiveSuggestionIndex(
        (currentIndex) =>
          currentIndex <= 0
            ? filteredSuggestions.length - 1
            : currentIndex - 1,
      );

      return;
    }

    if (
      event.key === "Enter" &&
      isSuggestionsOpen &&
      activeSuggestionIndex >= 0
    ) {
      event.preventDefault();

      const activeSuggestion =
        filteredSuggestions[
          activeSuggestionIndex
        ];

      if (activeSuggestion) {
        handleSuggestionSelect(
          activeSuggestion,
        );
      }

      return;
    }

    if (event.key === "Escape") {
      setIsSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
    }
  }

  return (
    <section
      className="homepage-hero"
      aria-labelledby="homepage-hero-title"
    >
      <div
        className="homepage-grid-pattern"
        aria-hidden="true"
      />

      <div
        className="
          homepage-glow
          homepage-glow--purple
          homepage-hero__glow-left
          animate-glow-pulse
        "
        aria-hidden="true"
      />

      <div
        className="
          homepage-glow
          homepage-glow--pink
          homepage-hero__glow-right
          animate-float-soft
        "
        aria-hidden="true"
      />

      <div className="container homepage-hero__inner">
        <div className="homepage-hero__content">
          <span className="eyebrow">
            Senapati&apos;s construction marketplace
          </span>

          <h1
            id="homepage-hero-title"
            className="homepage-hero__title"
          >
            Build with the right{" "}
            <span className="display-gradient">
              people, skills and materials.
            </span>
          </h1>

          <p className="homepage-hero__description">
            Find trusted skilled providers, labourers,
            contractors and construction-material suppliers
            through one professional local platform.
          </p>

          <div
            ref={searchContainerRef}
            className="homepage-hero__search"
          >
            <form
              className="home-search"
              role="search"
              aria-label="Search Yartong"
              data-open={isSuggestionsOpen}
              onSubmit={handleSubmit}
            >
              <div className="home-search__input-wrap">
                <label
                  className="sr-only"
                  htmlFor={inputId}
                >
                  Search for a worker, contractor or material
                </label>

                <SearchIcon
                  className="home-search__icon"
                />

                <input
                  id={inputId}
                  className="home-search__input"
                  type="search"
                  value={query}
                  placeholder="What service or material do you need?"
                  autoComplete="off"
                  enterKeyHint="search"
                  aria-autocomplete="list"
                  aria-controls={listboxId}
                  aria-expanded={isSuggestionsOpen}
                  aria-activedescendant={
                    activeSuggestionIndex >= 0
                      ? `${listboxId}-option-${activeSuggestionIndex}`
                      : undefined
                  }
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setIsSuggestionsOpen(true);
                    setActiveSuggestionIndex(-1);
                  }}
                  onFocus={() => {
                    setIsSuggestionsOpen(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              <div className="hero-location-field">
                <label
                  className="sr-only"
                  htmlFor={locationId}
                >
                  Search location
                </label>

                <select
                  id={locationId}
                  className="select hero-location-field__select"
                  value={location}
                  aria-label="Search location"
                  onChange={(event) => {
                    setLocation(event.target.value);
                  }}
                >
                  {LOCATIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="button button--primary button--lg"
                type="submit"
              >
                <SearchIcon className="button__icon" />

                <span className="button__label">
                  Search
                </span>
              </button>

              <div
                id={listboxId}
                className="home-search__suggestions"
                role="listbox"
                aria-label="Search suggestions"
              >
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map(
                    (suggestion, index) => {
                      const SuggestionIcon =
                        getSuggestionIcon(
                          suggestion.category,
                        );

                      const isActive =
                        activeSuggestionIndex ===
                        index;

                      return (
                        <button
                          id={`${listboxId}-option-${index}`}
                          key={suggestion.id}
                          className="home-search__suggestion"
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive}
                          onMouseEnter={() => {
                            setActiveSuggestionIndex(
                              index,
                            );
                          }}
                          onClick={() => {
                            handleSuggestionSelect(
                              suggestion,
                            );
                          }}
                        >
                          <span className="home-search__suggestion-icon">
                            <SuggestionIcon
                              className="button__icon"
                            />
                          </span>

                          <span className="home-search__suggestion-content">
                            <span className="home-search__suggestion-title">
                              {suggestion.label}
                            </span>

                            <span className="home-search__suggestion-meta">
                              {suggestion.description}
                            </span>
                          </span>

                          <span className="home-search__suggestion-type">
                            {suggestion.category
                              .replaceAll("_", " ")
                              .toLowerCase()}
                          </span>
                        </button>
                      );
                    },
                  )
                ) : (
                  <div className="home-search__empty">
                    <strong>
                      No exact result found yet
                    </strong>

                    <span>
                      Search anyway. We track unmet demand
                      so Yartong can add the services and
                      materials people need.
                    </span>

                    <button
                      className="button button--secondary button--sm"
                      type="button"
                      onClick={() => {
                        submitSearch(query);
                      }}
                    >
                      Search for “{query}”
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="hero-popular-searches">
            <span className="hero-popular-searches__label">
              Popular:
            </span>

            <div className="hero-popular-searches__list">
              {POPULAR_SEARCHES.map(
                (popularSearch) => (
                  <button
                    key={popularSearch}
                    className="hero-popular-searches__item"
                    type="button"
                    onClick={() => {
                      setQuery(popularSearch);

                      submitSearch(
                        popularSearch,
                        popularSearch ===
                          "Building materials"
                          ? "MATERIAL"
                          : popularSearch ===
                              "Contractors"
                            ? "CONTRACTOR"
                            : "WORKER",
                      );
                    }}
                  >
                    {popularSearch}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="homepage-hero__actions">
            <Link
              className="button button--primary button--lg"
              href="/post-job"
            >
              Post a Job
              <ArrowRightIcon className="button__icon" />
            </Link>

            <Link
              className="button button--outline button--lg"
              href="/workers"
            >
              Find Workers
            </Link>

            <Link
              className="button button--quick-job button--lg"
              href="/quick-jobs"
            >
              Quick Jobs
            </Link>
          </div>

          <div
            className="homepage-hero__trust"
            aria-label="Yartong platform benefits"
          >
            <span className="homepage-hero__trust-item">
              <span className="homepage-hero__trust-icon">
                <ShieldCheckIcon
                  className="button__icon"
                />
              </span>

              Verification and ratings
            </span>

            <span className="homepage-hero__trust-item">
              <span className="homepage-hero__trust-icon">
                <MessageIcon
                  className="button__icon"
                />
              </span>

              Platform-first contact
            </span>

            <span className="homepage-hero__trust-item">
              <span className="homepage-hero__trust-icon">
                <ChartIcon
                  className="button__icon"
                />
              </span>

              Business growth insights
            </span>
          </div>
        </div>

        <div
          className="hero-analytics animate-float-soft"
          aria-label="Yartong business intelligence preview"
        >
          <div className="hero-analytics__header">
            <div>
              <span className="eyebrow eyebrow--plain">
                Business intelligence
              </span>

              <h2 className="hero-analytics__title">
                Turn local demand into growth
              </h2>
            </div>

            <span className="hero-analytics__live">
              Live insights
            </span>
          </div>

          <div
            className="hero-analytics__chart"
            aria-hidden="true"
          >
            <div className="hero-analytics__chart-fill" />
            <div className="hero-analytics__chart-line" />
          </div>

          <div className="hero-analytics__metrics">
            <div className="hero-analytics__metric">
              <span className="hero-analytics__metric-value">
                91%
              </span>

              <span className="hero-analytics__metric-label">
                Response rate
              </span>
            </div>

            <div className="hero-analytics__metric">
              <span className="hero-analytics__metric-value">
                4.8
              </span>

              <span className="hero-analytics__metric-label">
                Average rating
              </span>
            </div>

            <div className="hero-analytics__metric">
              <span className="hero-analytics__metric-value">
                +18%
              </span>

              <span className="hero-analytics__metric-label">
                Profile growth
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;