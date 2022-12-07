# Metrics

Collect metrics with simple and concise API.

Uses [Mesh IoC](https://github.com/nodescriptlang/mesh).

## Usage

1. Use counters, gauges and histograms to collect metrics in your application.

    ```ts
    export class MyService {

        @metric()
        counter = new CounterMetric('my_service_counter_total', 'Total number of times something important happened.');

        doSomething() {
            // ...
            counter.incr();
        }

    }
    ```

2. Generate a Prometheus report from all metrics defined in your mesh:

    ```ts
    const report = generateMetricsReport(mesh);
    ```
