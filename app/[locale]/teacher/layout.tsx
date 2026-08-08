export default function TeacherLayout({ children } : { children: React.ReactNode }) {
    return (
        <div className="flex-1 bg-surface px-7 pb-16 pt-10">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </div>
    )
}