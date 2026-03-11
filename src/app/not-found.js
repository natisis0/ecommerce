import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-gray-900 mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
