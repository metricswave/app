export const isCurrentRoute = (currentPath: string, path: string): boolean => {
    return currentPath === path || (path !== "/" && currentPath.startsWith(path));
};

export const currentPathIs = (path: string): boolean => {
    const currentPath = window.location.pathname;
    return currentPath === path || (path !== "/" && currentPath.startsWith(path));
};

export const currentPathStartsWith = (path: string): boolean => {
    return window.location.pathname.startsWith(path);
};
