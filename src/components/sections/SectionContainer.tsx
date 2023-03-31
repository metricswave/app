export default function SectionContainer({children, ...props}: { children: React.ReactNode }) {
    return (
            <div className="mt-1 p-6 flex flex-col space-y-6">
                {children}
            </div>
    )
}
