interface Window {
    metricswave: {
        track: (uuid: string, params: { [key: string]: string | number }) => void;
        setUser: (userId: null | string) => void;
    };
}
