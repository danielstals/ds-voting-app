import { Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { combineLatest, filter, Observable } from 'rxjs';
import { SubscriptionComponent } from 'src/app/core/helpers/subscription.helper';
import { VotingState } from '../../state/voting.state';

@Component({
  selector: 'ds-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends SubscriptionComponent implements OnInit {
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: true,
        grid: {
          color: 'rgba(128,151,177, 0.3)',
          borderDash: [3, 5],
          drawTicks: false,
          borderColor: '#424b5f',
        },
      },
      y: {
        min: 0,
        offset: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: 'rgba(128,151,177, 0.3)',
          borderDash: [3, 3],
          drawTicks: false,
          borderColor: '#424b5f',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Poll results',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Select(VotingState.question)
  public question$: Observable<string>;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.addSub(
      combineLatest([
        this.question$,
        this.store.select(VotingState.votingChartData()),
      ]).subscribe(([question, chartData]: [string, ChartData<'bar'>]) => {
        this.barChartData.datasets[0].label = `Results for: ${question}`;
        this.barChartData.labels = chartData.labels;
        this.barChartData.datasets[0].data = chartData.datasets[0].data;

        this.chart?.update();
      })
    );
  }

  get chartHasData(): boolean {
    return (
      this.barChartData.datasets?.length > 0 &&
      this.barChartData.datasets[0].data?.length > 0
    );
  }
}
