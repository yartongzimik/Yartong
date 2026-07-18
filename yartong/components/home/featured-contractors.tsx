import Link from "next/link";

interface Contractor {
  id: string;
  company: string;
  owner: string;
  location: string;
  rating: number;
  completedProjects: number;
  teamSize: string;
  specialties: string[];
  verified: boolean;
}

const CONTRACTORS: Contractor[] = [
  {
    id: "contractor-001",
    company: "Hillstone Builders",
    owner: "A. Poumai",
    location: "Senapati",
    rating: 4.9,
    completedProjects: 134,
    teamSize: "22 workers",
    specialties: [
      "Residential",
      "Commercial",
      "Road Construction",
    ],
    verified: true,
  },
  {
    id: "contractor-002",
    company: "Northern Engineering",
    owner: "S. Shimray",
    location: "Mao",
    rating: 4.8,
    completedProjects: 102,
    teamSize: "18 workers",
    specialties: [
      "Buildings",
      "Government Projects",
      "Drainage",
    ],
    verified: true,
  },
  {
    id: "contractor-003",
    company: "Peak Infrastructure",
    owner: "L. Pao",
    location: "Kangpokpi",
    rating: 4.7,
    completedProjects: 81,
    teamSize: "15 workers",
    specialties: [
      "Schools",
      "Retaining Walls",
      "Bridges",
    ],
    verified: true,
  },
];

export default function FeaturedContractors() {
  return (
    <section className="homepage-section">
      <div className="container">

        <div className="section-header">
          <div>
            <span className="eyebrow">
              Trusted companies
            </span>

            <h2 className="heading-2">
              Hire experienced contractors.
            </h2>

            <p className="section-description">
              Compare construction companies,
              previous projects, ratings,
              team size and specialties before
              requesting quotations.
            </p>
          </div>

          <Link
            href="/contractor"
            className="button button--outline"
          >
            View All Contractors
          </Link>
        </div>

        <div className="home-featured-grid">

          {CONTRACTORS.map((contractor) => (

            <article
              key={contractor.id}
              className="card card--interactive"
            >

              <div className="card__body">

                <h3>{contractor.company}</h3>

                <p>
                  Owner: {contractor.owner}
                </p>

                <p>
                  📍 {contractor.location}
                </p>

                <p>
                  ⭐ {contractor.rating}
                </p>

                <p>
                  {contractor.completedProjects} completed projects
                </p>

                <p>
                  Team Size: {contractor.teamSize}
                </p>

                <div className="worker-card__skills">
                  {contractor.specialties.map((item) => (
                    <span
                      key={item}
                      className="worker-card__skill"
                    >
                      {item}
                    </span>
                  ))}
                </div>

              </div>

              <div className="card__footer">

                <Link
                  href={`/contractor/${contractor.id}`}
                  className="button button--outline"
                >
                  View Profile
                </Link>

                <Link
                  href={`/messages?recipient=${contractor.id}`}
                  className="button button--primary"
                >
                  Request Quote
                </Link>

              </div>

            </article>

          ))}

        </div>

      </div>
    </section>
  );
}