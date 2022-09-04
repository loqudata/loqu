
import { EditableGridCell, GridCellKind } from "@glideapps/glide-data-grid";
import isArray from "lodash/isArray";

function isTruthy(x: any): boolean {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return x ? true : false;
}

/**
 * Attempts to copy data between grid cells of any kind.
 */
 function lossyCopyData<T extends EditableGridCell>(source: EditableGridCell, target: T): EditableGridCell {
    const sourceData = source.data;
    if (typeof sourceData === typeof target.data) {
        return {
            ...target,
            data: sourceData as any,
        };
    } else if (target.kind === GridCellKind.Uri) {
        if (isArray(sourceData)) {
            return {
                ...target,
                data: sourceData[0],
            };
        }
        return {
            ...target,
            data: sourceData?.toString() ?? "",
        };
    } else if (target.kind === GridCellKind.Boolean) {
        if (isArray(sourceData)) {
            return {
                ...target,
                data: sourceData[0] !== undefined,
            };
        }
        return {
            ...target,
            data: isTruthy(sourceData) ? true : false,
        };
    } else if (target.kind === GridCellKind.Image) {
        if (isArray(sourceData)) {
            return {
                ...target,
                data: [sourceData[0]],
            };
        }
        return {
            ...target,
            data: [sourceData?.toString() ?? ""],
        };
    } else if (target.kind === GridCellKind.Number) {
        return {
            ...target,
            data: 0,
        };
    } else if (target.kind === GridCellKind.Text || target.kind === GridCellKind.Markdown) {
        if (isArray(sourceData)) {
            return {
                ...target,
                data: sourceData[0].toString() ?? "",
            };
        }

        return {
            ...target,
            data: source.data?.toString() ?? "",
        };
    }
    assertNever(target);
}

export function proveType<T>(_val: T) {
    // do nothing, just prove the compiler thinks the types match
}

function panic(message: string = "This should not happen"): never {
    throw new Error(message);
}

export function assert(fact: boolean, message: string = "Assertion failed"): asserts fact {
    if (fact) return;
    return panic(message);
}

export function assertNever(_never: never): never {
    return panic("Hell froze over");
}
export function maybe<T>(fn: () => T, defaultValue: T) {
    try {
        const result = fn();
        return result;
    } catch {
        return defaultValue;
    }
}
