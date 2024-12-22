const Sidebar = () => {
    return (
        <div className="flex flex-col h-screen border-r border-slate-500">
            {/* Search Input */}
            <div className="p-4">
                <SearchInput />
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                <Conversations />
            </div>

        </div>
    );
};

export default Sidebar;
