import Link from 'next/link';
import Button from '../Button';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-6 container mx-auto">
            <div className="text-xl font-bold">School Portal</div>
            <div className="space-x-4">
                <Link href="/login">
                    <Button variant="outline" size="sm">Login</Button>
                </Link>
            </div>
        </nav>
    );
}
