import { Link } from '@inertiajs/react';

export default function Pagination({ links }: { links: { url: string | null; label: string; active: boolean }[] }) {
    return (
        <div className="flex justify-center mt-4 space-x-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 border text-sm rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                />
            ))}
        </div>
    );
}
