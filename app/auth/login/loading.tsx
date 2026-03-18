export default function LoginLoading() {
  return (
    <div className="flex min-h-screen w-full animate-pulse">
      {/* Left Panel — brand + hero */}
      <div className="hidden w-1/2 flex-col justify-center gap-10 bg-[#F0EDE8] px-20 py-16 lg:flex">
        <div className="h-60 w-full rounded-[20px] bg-bg-muted" />

        <div className="h-6 w-72 rounded bg-bg-muted" />

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 rounded bg-bg-muted" />
            <div className="h-4 w-52 rounded bg-bg-muted" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 rounded bg-bg-muted" />
            <div className="h-4 w-60 rounded bg-bg-muted" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 shrink-0 rounded bg-bg-muted" />
            <div className="h-4 w-56 rounded bg-bg-muted" />
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex w-full items-center justify-center bg-bg-card px-8 py-16 lg:w-1/2 lg:px-20">
        <div className="w-full max-w-[400px]">
          {/* Heading */}
          <div className="mb-8 flex flex-col gap-2">
            <div className="h-8 w-44 rounded bg-bg-muted" />
            <div className="h-4 w-72 rounded bg-bg-muted" />
          </div>

          {/* Email label + input */}
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-24 rounded bg-bg-muted" />
            <div className="h-12 w-full rounded-full bg-bg-muted" />
          </div>

          {/* Submit button */}
          <div className="mt-4 h-12 w-full rounded-full bg-bg-muted" />

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E8E4DF]" />
            <div className="h-3 w-4 rounded bg-bg-muted" />
            <div className="h-px flex-1 bg-[#E8E4DF]" />
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <div className="h-12 w-full rounded-full border border-[#E8E4DF] bg-bg-muted" />
            <div className="h-12 w-full rounded-full border border-[#E8E4DF] bg-bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
