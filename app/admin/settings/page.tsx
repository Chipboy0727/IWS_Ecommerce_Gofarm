import type { Metadata } from "next";
import { AdminActionButton, AdminShell, Pill, SectionCard } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "System Settings | GoFarm",
  description: "System settings screen for GoFarm admin.",
};

export default function SettingsPage() {
  return (
    <AdminShell
      activeHref="/admin/settings"
      title="System Configuration"
      subtitle="Manage your global enterprise settings, financial gateways, and security protocols from a centralized control hub."
      searchPlaceholder="Search system settings..."
      userName="Alex Mercer"
      userRole="System Admin"
      userLabel="Admin Console"
      actions={<AdminActionButton tone="primary">Save Changes</AdminActionButton>}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Pill tone="green">General Settings</Pill>
          <Pill tone="gray">Payment Gateway</Pill>
          <Pill tone="gray">Shipping Rules</Pill>
          <Pill tone="gray">Security</Pill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.7fr]">
          <SectionCard title="General Identity" subtitle="Primary organization details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Site Name" value="GoFarm Digital Ecosystem" />
              <Field label="Support Email" value="ops@gofarm.io" />
              <div className="sm:col-span-2">
                <Field label="Company Description" value="The ultimate high-tech hub for local agricultural commerce and supply chain management." multiline />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button className="rounded-md bg-[#eef4e7] px-4 py-2 text-[13px] font-semibold text-[#50604f]">Discard Changes</button>
              <button className="rounded-md bg-[#0f9716] px-4 py-2 text-[13px] font-semibold text-white">Update General</button>
            </div>
          </SectionCard>

          <SectionCard title="Brand Assets" subtitle="Logo and image upload">
            <div className="rounded-[18px] border border-dashed border-[#c9d6bd] bg-[#f4f7ee] p-6 text-center">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-2xl bg-[#dfead2] text-[#7b8c78]">
                <IconUpload />
              </div>
              <div className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#839081]">Upload Logo</div>
              <div className="mt-2 text-[12px] leading-5 text-[#768473]">Recommended: 512x512 SVG or PNG with transparent background.</div>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <SectionCard className="bg-[linear-gradient(180deg,#0f7d17_0%,#0d6512_100%)] text-white" title="Finance Engine" subtitle="Configure how GoFarm handles transactions, commissions, and farmer payouts.">
            <div className="space-y-3">
              <Row label="Stripe Connect" status="Active" />
              <Row label="Crypto Payouts" status="Disabled" muted />
              <button className="mt-3 rounded-md bg-white px-4 py-2 text-[13px] font-semibold text-[#176c1b]">Configure Gateways</button>
            </div>
          </SectionCard>

          <SectionCard title="Payment Parameters" subtitle="Financial configuration">
            <div className="space-y-4">
              <Param label="Platform Fee" value="2.5 %" />
              <ToggleRow label="Automatic Payouts" enabled />
              <Param label="Global Tax Rate" value="15 %" />
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard title="Shipping Logistics" subtitle="Delivery rules and base rates">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Base Delivery Fee" value="$ 5.00" />
              <Field label="Max Delivery Radius (km)" value="50" />
            </div>
          </SectionCard>

          <SectionCard title="Security Enforcement" subtitle="Access and permission controls">
            <div className="space-y-3">
              <ToggleRow label="Two-Factor Authentication (Admin)" enabled />
              <ToggleRow label="Force Password Change (90 days)" />
              <div className="flex items-center justify-between rounded-md border border-[#f0d2d0] bg-[#fff4f4] px-4 py-3 text-[13px]">
                <div className="text-[#6a5d5d]">IP Restricted Login</div>
                <div className="font-semibold uppercase text-[#ce4b42]">Configure Whitelist</div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="rounded-[18px] border border-[#f1c4c4] bg-[#f8d9d7] px-5 py-4 text-[13px] text-[#8b4f4d]">
          <div className="font-semibold">Critical Warning</div>
          <div className="mt-1">Changing system settings can affect current transactions and live storefront availability. Ensure you have backed up the database before finalizing major gateway shifts.</div>
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <label className="block">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#82907f]">{label}</div>
      <div className={["rounded-md bg-[#eef4e7] px-4 py-3 text-[13px] text-[#263225]", multiline ? "min-h-[82px] leading-6" : ""].join(" ")}>{value}</div>
    </label>
  );
}

function Row({ label, status, muted = false }: { label: string; status: string; muted?: boolean }) {
  return (
    <div className={["flex items-center justify-between rounded-md border px-4 py-3 text-[13px]", muted ? "border-white/10 bg-white/5" : "border-white/10 bg-white/10"].join(" ")}>
      <div>{label}</div>
      <div className={["rounded-full px-3 py-1 text-[11px] font-semibold uppercase", status === "Active" ? "bg-white text-[#176c1b]" : "bg-white/15 text-white"].join(" ")}>{status}</div>
    </div>
  );
}

function Param({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#eef4e7] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#82907f]">{label}</div>
      <div className="mt-2 flex items-center justify-between text-[13px] text-[#253323]">
        <span>{value}</span>
        <span className="font-semibold text-[#176c1b]">%</span>
      </div>
    </div>
  );
}

function ToggleRow({ label, enabled = false }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-[#eef4e7] px-4 py-3 text-[13px]">
      <div className="text-[#253323]">{label}</div>
      <div className={["h-5 w-9 rounded-full p-0.5 transition", enabled ? "bg-[#0f9716]" : "bg-[#d6ddcd]"].join(" ")}>
        <div className={["h-4 w-4 rounded-full bg-white transition", enabled ? "translate-x-4" : ""].join(" ")} />
      </div>
    </div>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
      <path d="M12 16V6m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 18.5h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
