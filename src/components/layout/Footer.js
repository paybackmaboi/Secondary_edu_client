export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white p-8 mt-auto">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} School Management System.</p>
            </div>
        </footer>
    );
}
