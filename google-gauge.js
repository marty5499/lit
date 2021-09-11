import { html, css, LitElement } from 'lit';

export class google_gauge extends LitElement {
    static styles = css `
      :host {
        color: red;
      }
    `;
    static get properties() {
        return {
            name: { type: String },
            width: { type: String },
            value: { type: Number }
        }
    }

    constructor() {
        super();
        this.name = '';
    }

    show() {
        console.log("show:")
    }

    firstUpdated(idx) {
        var self = this
        window.ele = self
        google.charts.load('current', { 'packages': ['gauge'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            if (!self.value) self.value = 0;
            self.data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                [self.name, self.value]
            ]);
            self.options = {
                width: parseInt(self.width),
                height: parseInt(self.width),
                greenFrom: 40,
                greenTo: 75,
                yellowFrom: 75,
                yellowTo: 90,
                redFrom: 90,
                redTo: 100,
                minorTicks: 5
            };
            self.chart = new google.visualization.Gauge(self.shadowRoot.firstElementChild);
            self.chart.draw(self.data, self.options);
        }
    }

    updated() {
        if (this.data) {
            this.options.width = parseInt(this.width)
            this.options.height = parseInt(this.height)
            this.data.setValue(0, 1, this.value);
            this.chart.draw(this.data, this.options);
        }
    }

    render() {
        return html `<div></div>`;
    }
}

customElements.define('google-gauge', google_gauge);