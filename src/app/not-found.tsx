import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full p-20">
            <h1 className="font-bold">404 - Page Not Found</h1>
            <p className="">The page you are looking for does not exist.</p>
            <Link href="/" className="text-blue-500 mt-4 hover:underline">
                Go back to the home page
            </Link>
        </div>
    );
}
