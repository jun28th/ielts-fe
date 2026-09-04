export default function AdminLayout({ children } : { children: React.ReactNode }) {
    return (
        <div className="flex-1 bg-surface px-7 pb-16 pt-10">
            {children}
        </div>
    )
}