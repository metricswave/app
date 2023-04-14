export const isCurrentRoute = (currentPath: string, path: string): boolean => {
    return currentPath === path
        || (path !== "/" && currentPath.startsWith(path))
}
