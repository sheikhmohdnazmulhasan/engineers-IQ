
export const SidebarSection = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {children}
    </div>
)