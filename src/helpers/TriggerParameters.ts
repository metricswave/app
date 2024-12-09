export function mapParameterName(parameter: string): string {
    return parameter;
}

export function mergeGlobalParameters(parameters: string[]): string[] {
    parameters = parameters ?? [];
    if (!parameters.includes("user_parameter")) {
        parameters.push("user_parameter");
    }
    return parameters;
}
