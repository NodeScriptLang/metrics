import { Mesh } from 'mesh-ioc';

import { BaseMetric } from './BaseMetric.js';

export interface MetricDescriptor {
    target: any;
    propertyKey: string;
}

export const metricDescriptors: MetricDescriptor[] = [];

export function metric() {
    return (target: any, propertyKey: string) => {
        metricDescriptors.push({
            target,
            propertyKey,
        });
    };
}

export function* collectMetrics(mesh: Mesh, recursive = true): Iterable<BaseMetric> {
    for (const [key, binding] of mesh) {
        if (binding.type === 'service') {
            for (const desc of metricDescriptors) {
                if (desc.target.constructor === binding.class || desc.target.isPrototypeOf(binding.class)) {
                    const instance = mesh.resolve(key) as any;
                    const value = instance[desc.propertyKey];
                    if (value instanceof BaseMetric) {
                        yield value;
                    }
                }
            }
        }
    }
    if (recursive && mesh.parent) {
        yield* collectMetrics(mesh.parent, recursive);
    }
}

export function generateMetricsReport(mesh: Mesh, recursive = true) {
    const all = [...collectMetrics(mesh, recursive)];
    return all.map(_ => _.report()).join('\n\n');
}
