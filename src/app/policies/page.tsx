import Section from "@/components/Section";

export default function PoliciesPage() {
  return (
    <Section>
      <h1 className="h2">Policies</h1>
      <div className="mt-6 space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Cancellations</h3>
          <p className="mt-2 text-sm text-black/70">
            Please cancel or reschedule at least 24 hours in advance to avoid a fee.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Late Arrivals</h3>
          <p className="mt-2 text-sm text-black/70">More than 10 minutes late may require rescheduling.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">No-Show</h3>
          <p className="mt-2 text-sm text-black/70">No-shows may be charged up to 100% of the service.</p>
        </div>
      </div>
    </Section>
  );
}
