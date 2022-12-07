export interface MetricDatum<L> {
    labels: Partial<L>;
    timestamp?: number;
    value: number;
}

export abstract class Metric<L = any> {

    constructor(
        public name: string,
        public help: string,
    ) {}

    abstract getType(): string;

    protected abstract generateReportLines(): Iterable<string>;

    getMetricLineName(labels: Partial<L>, suffix: string = '') {
        const buf = [this.name, suffix];
        const labelStr = this.createMetricLabelsKey(labels);
        if (labelStr) {
            buf.push('{', labelStr, '}');
        }
        return buf.join('');
    }

    report() {
        const report = [];
        report.push(`# HELP ${this.name} ${this.help}`);
        report.push(`# TYPE ${this.name} ${this.getType()}`);
        report.push(...this.generateReportLines());
        return report.join('\n') + '\n';
    }

    protected createMetricLabelsKey<L>(labels: Partial<L> = {}) {
        return Object.keys(labels)
            .sort()
            .map(k => {
                const v = (labels as any)[k];
                return `${k}=${JSON.stringify(String(v))}`;
            })
            .join(',');
    }

}
