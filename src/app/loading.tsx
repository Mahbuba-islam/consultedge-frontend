export default function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div
        className="size-12 animate-spin rounded-full border-4 border-cyan-200/60 border-t-blue-600 dark:border-white/10 dark:border-t-cyan-400"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
