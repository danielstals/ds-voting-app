import { Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { SubscriptionComponent } from 'src/app/core/helpers/subscription.helper';
import { VotingResult } from '../../models/voting-result.model';
import { VotingState } from '../../state/voting.state';

@Component({
  selector: 'ds-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends SubscriptionComponent implements OnInit {
  public totalVotingResults: number;

  /**
   * Voting result chart configuration for Chart.js
   */
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
        align: 'start',
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
        label: 'Poll results chart',
        data: [],
        backgroundColor: [
          'rgba(26, 188, 156, 0.2)',
          'rgba(192, 57, 43, 0.2)',
          'rgba(52, 152, 219, 0.2)',
          'rgba(155, 89, 182, 0.2)',
          'rgba(241, 196, 15, 0.2)',
          'rgba(230, 126, 34, 0.2)',
          'rgba(231, 76, 60, 0.2)',
          'rgba(44, 62, 80, 0.2)',
          'rgba(189, 195, 199,0.2)',
        ],
        borderColor: [
          'rgb(26, 188, 156)',
          'rgb(192, 57, 43)',
          'rgb(52, 152, 219)',
          'rgb(155, 89, 182)',
          'rgb(241, 196, 15)',
          'rgb(230, 126, 34)',
          'rgb(231, 76, 60)',
          'rgb(44, 62, 80)',
          'rgb(189, 195, 199)',
        ],
        borderWidth: 1,
      },
    ],
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Select(VotingState.question)
  public question$: Observable<string>;

  @Select(VotingState.votingResults)
  public votingResults$: Observable<VotingResult[]>;

  constructor(private store: Store) {
    super();
  }

  /**
   * On component initialisation subscribe to changes on the voting results chart data,
   * and update the chart accordingly.
   */
  public ngOnInit(): void {
    this.addSub(
      this.store.select(VotingState.votingChartData()).subscribe((chartData: ChartData<'bar'>) => {
        this.barChartData.labels = chartData.labels;
        this.barChartData.datasets[0].data = chartData.datasets[0].data;

        this.chart?.update();
      })
    );

    this.addSub(
      this.votingResults$.subscribe((vrs: VotingResult[]) => {
        this.totalVotingResults = vrs.reduce((acc: number, vr: VotingResult) => {
          return acc + vr.amountOfVotes;
        }, 0);
      })
    );
  }

  /**
   * Getter that checks if the chart has data available.
   */
  public get chartHasData(): boolean {
    return this.barChartData.datasets?.length > 0 && this.barChartData.datasets[0].data?.length > 0;
  }
}
