interface Window {
    metricswave: {
        track: (uuid: string, params: { [key: string]: string | number }) => void;
        setUserId: (userId: null | string) => void;
    };
}
