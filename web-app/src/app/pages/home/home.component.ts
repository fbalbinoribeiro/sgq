import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/stores/app-state';
import { settingsSelectors } from 'src/app/stores/settings/settings.selector';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  chart1: any;
  chart2: any;

  unsub$ = new Subject<void>();

  constructor(private readonly store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  ngOnInit() {
    this.store
      .select(settingsSelectors.selectAccessibilityMode)
      .pipe(takeUntil(this.unsub$))
      .subscribe(async (accessibility) => {
        const fontSize = accessibility ? 24 : 16;
        const fontColor = accessibility ? '#FFF' : '#000';
        const redColor = accessibility ? '#FF0000' : 'rgb(255, 99, 132)';
        const yellowColor = accessibility ? '#CCCC00' : 'rgb(255, 205, 86)';
        const greenColor = accessibility ? '#0000FF' : 'rgb(99, 140, 22)';

        Chart.defaults.font.size = fontSize;
        Chart.defaults.color = fontColor;

        if (this.chart1) {
          this.chart1.destroy();
          this.chart2.destroy();
        }

        this.chart1 = new Chart('canvas1', {
          type: 'doughnut',
          data: {
            labels: ['Novas', 'Em tratamento', 'Finalizadas'],
            datasets: [
              {
                label: 'Ocorrências no ano',
                data: [300, 50, 100],
                backgroundColor: [redColor, yellowColor, greenColor],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Ocorrências no ano',
              },
            },
          },
        });

        this.chart2 = new Chart('canvas2', {
          type: 'bar',
          data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
            datasets: [
              {
                label: 'Qtd',
                data: [6, 9, 8, 1, 5, 5, 4],
                backgroundColor: [redColor],
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              datalabels: {
                anchor: 'start',
                align: 'top',
                formatter: Math.round,
                font: {
                  weight: 'bold',
                  size: fontSize,
                },
              },
              title: {
                display: true,
                text: 'Ocorrências no mês',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });

    this.chart2.canvas.parentNode.style.height = '300px';
  }
}
