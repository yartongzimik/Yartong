import Link from "next/link";
import {
  JobBudgetType,
  JobProviderRole,
  JobStatus,
  JobUrgency,
} from "@prisma/client";

import {
  JOB_BUDGET_TYPE_LABELS,
  JOB_PROVIDER_ROLE_LABELS,
  JOB_STATUS_LABELS,
  JOB_URGENCY_LABELS,
  ROUTES,
} from "@/lib/constants";
import { paiseToRupees } from "@/lib/jobs/validation";
import type { PublicJob } from "@/lib/marketplace/jobs";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-white/75">
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}

export function JobCard({ job }: { job: PublicJob }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-white">
      <div className="flex justify-between gap-3">
        <span className="rounded-full bg-fuchsia-200/10 px-3 py-1 text-xs font-black text-fuchsia-100">
          {job.category}
        </span>
        <span className="text-sm text-white/60">
          {JOB_URGENCY_LABELS[job.urgency]}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-black">
        <Link href={`${ROUTES.jobs}/${job.id}`}>{job.title}</Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/65">
        {job.description}
      </p>
      <p className="mt-4 font-bold">{job.budgetLabel}</p>
      <p className="mt-1 text-sm text-white/60">
        {job.location.name}, {job.location.state}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

type JobFormAction = (formData: FormData) => void | Promise<void>;

type JobFormData = {
  title: string;
  description: string;
  category: string;
  skills: string[];
  targetProviderRoles: JobProviderRole[];
  locationId: string;
  budgetType: JobBudgetType;
  budgetMin: number | null;
  budgetMax: number | null;
  urgency: JobUrgency;
  preferredStartDate: Date | null;
};

export function JobForm({
  action,
  locations,
  submitLabel = "Publish job",
  draftLabel = "Save draft",
  mode = "create",
  job,
}: {
  action: JobFormAction;
  locations: { id: string; name: string; state: string }[];
  submitLabel?: string;
  draftLabel?: string;
  mode?: "create" | "edit";
  job?: JobFormData;
}) {
  return (
    <form
      action={action}
      className="mt-8 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white"
    >
      <label className="grid gap-2">
        Title
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={job?.title}
          className="rounded-xl border border-white/10 bg-black/30 p-3"
        />
      </label>

      <label className="grid gap-2">
        Description
        <textarea
          name="description"
          required
          maxLength={5000}
          defaultValue={job?.description}
          rows={6}
          className="rounded-xl border border-white/10 bg-black/30 p-3"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          Category
          <input
            name="category"
            required
            defaultValue={job?.category}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
        </label>

        <label className="grid gap-2">
          Skills (comma separated)
          <input
            name="skills"
            required
            defaultValue={job?.skills.join(", ")}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
        </label>

        <label className="grid gap-2">
          Location
          <select
            name="locationId"
            required
            defaultValue={job?.locationId}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          >
            <option value="">Choose location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}, {location.state}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          Urgency
          <select
            name="urgency"
            defaultValue={job?.urgency ?? JobUrgency.STANDARD}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          >
            {Object.values(JobUrgency).map((urgency) => (
              <option key={urgency} value={urgency}>
                {JOB_URGENCY_LABELS[urgency]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          Budget type
          <select
            name="budgetType"
            defaultValue={job?.budgetType ?? JobBudgetType.NEGOTIABLE}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          >
            {Object.values(JobBudgetType).map((budgetType) => (
              <option key={budgetType} value={budgetType}>
                {JOB_BUDGET_TYPE_LABELS[budgetType]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          Budget min (₹)
          <input
            name="budgetMin"
            inputMode="decimal"
            defaultValue={paiseToRupees(job?.budgetMin)}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
        </label>

        <label className="grid gap-2">
          Budget max (₹)
          <input
            name="budgetMax"
            inputMode="decimal"
            defaultValue={paiseToRupees(job?.budgetMax)}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
        </label>

        <label className="grid gap-2">
          Preferred start date
          <input
            name="preferredStartDate"
            type="date"
            defaultValue={job?.preferredStartDate?.toISOString().slice(0, 10)}
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend>Target worker roles</legend>
        <div className="flex flex-wrap gap-4">
          {Object.values(JobProviderRole).map((role) => (
            <label key={role} className="flex gap-2">
              <input
                type="checkbox"
                name="targetProviderRoles"
                value={role}
                defaultChecked={job?.targetProviderRoles.includes(role)}
              />
              {JOB_PROVIDER_ROLE_LABELS[role]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3">
        {mode === "create" ? (
          <button
            name="intent"
            value="draft"
            className="rounded-full border border-white/15 px-5 py-3 font-black"
          >
            {draftLabel}
          </button>
        ) : null}
        <button
          name="intent"
          value={mode === "create" ? "publish" : "draft"}
          className="rounded-full bg-white px-5 py-3 font-black text-[#14091f]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
