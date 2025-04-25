import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { UserService } from '../services/user.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dahsboard-user',
  templateUrl: './dahsboard-user.component.html',
  styleUrls: ['./dahsboard-user.component.css']
})
export class DahsboardUserComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;

  // >>> AJOUTEZ CES DEUX PROPRIÉTÉS ICI <<<
  @ViewChild('projectionActualChart') projectionActualChartRef!: ElementRef; // Référence à la div HTML
  private projectionActualChartInstance: any; // Variable pour l'instance ECharts


  projectionNewUsers = 150;
  actualNewUsers = 0;
  isLoadingProjectionActual = true;

  userCount: number = 0;
  isLoading: boolean = true;
  stats = { active: 0, banned: 0 };
  newCustomersCountLastWeek: number = 0;
  isLoadingNewCustomersCount: boolean = true;
  newCustomersGrowthPercentage: number | null = null;
  isLoadingNewCustomersGrowth: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.loadStats();
    this.loadNewCustomersCountLastWeek();
    this.loadNewCustomersGrowthPercentage();

    this.loadProjectionActualData('week');

  }

  ngAfterViewInit(): void {
    this.initBarChart();
    this.initLineChart();


     setTimeout(() => {
        if (this.projectionActualChartRef && this.projectionActualChartRef.nativeElement) {
            this.initProjectionActualChart();
        } else {
            console.error("L'élément du graphique 'projectionActualChart' n'a pas été trouvé dans le DOM.");
        }
    }, 0);

  }

  loadUserCount(): void {
    this.userService.countUsernames().subscribe({
      next: (count) => {
        this.userCount = count;
      },
      error: (err) => {
        console.error('Failed to load user count', err);
      }
    });
  }

  loadStats(): void {
    this.isLoading = true;
    this.userService.getUsersWithStatus().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user stats', err);
        this.isLoading = false;
      }
    });
  }

  getPercentage(count: number): number {
    const total = this.stats.active + this.stats.banned;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  private initBarChart(): void {
    const chart = echarts.init(this.barChartRef.nativeElement);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {},
      xAxis: {
        type: 'category',
        data: ['Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Projected revenue',
          type: 'bar',
          data: [28000, 29000, 30000, 30500, 31000, 31302],
          itemStyle: { color: '#85A9FF' }
        },
        {
          name: 'Actual revenue',
          type: 'bar',
          data: [27800, 28800, 29500, 29950, 30800, 31034],
          itemStyle: { color: '#1A2431' }
        }
      ]
    };
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
  }

  private initLineChart(): void {
    const chart = echarts.init(this.lineChartRef.nativeElement);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total Sales',
          type: 'line',
          data: [5000, 7000, 7500, 7800, 8200, 9000],
          itemStyle: { color: '#85A9FF' },
          lineStyle: { width: 2 },
          smooth: true
        }
      ]
    };
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
  }


  loadProjectionActualData(period: string): void {
      this.isLoadingProjectionActual = true;
      this.userService.getNewUserCount(period).subscribe({
          next: (count: number) => {
              console.log(`Nombre réel de nouveaux utilisateurs (${period}):`, count);
              this.actualNewUsers = count;
              this.isLoadingProjectionActual = false;
              this.updateProjectionActualChart();
          },
          error: (err: any) => {
              console.error(`Erreur lors du chargement des données Projection vs Réel pour la période '${period}'`, err);
              this.isLoadingProjectionActual = false;
              this.actualNewUsers = 0;
              this.updateProjectionActualChart();
          }
      });
  }
  // >>> FIN DE L'AJOUT <<<


  loadNewCustomersCountLastWeek(): void {
    this.isLoadingNewCustomersCount = true;
    this.userService.countNewUsersLastWeek().subscribe({
      next: (count: number) => {
        console.log('Nombre de nouveaux clients dernière semaine:', count);
        this.newCustomersCountLastWeek = count;
        this.isLoadingNewCustomersCount = false;
      },
      error: (err) => {
        console.error('Erreur chargement nombre nouveaux clients dernière semaine', err);
        this.isLoadingNewCustomersCount = false;

         this.newCustomersCountLastWeek = 0;
      }
    });
  }
  loadNewCustomersGrowthPercentage(): void {
    this.isLoadingNewCustomersGrowth = true;
    this.userService.getNewCustomersGrowthPercentage().subscribe({
      next: (percentage: number) => {
        console.log('Pourcentage de croissance Nouveaux Clients:', percentage);
        this.newCustomersGrowthPercentage = percentage;
        this.isLoadingNewCustomersGrowth = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement pourcentage croissance', err);
        this.isLoadingNewCustomersGrowth = false;
        this.newCustomersGrowthPercentage = null;
      }
    });
  }
  formatGrowthPercentage(percentage: number | null): string {
    if (percentage === null) {
      return '--';
    }
    if (typeof percentage !== 'number' || isNaN(percentage)) {
         return '--';
    }

    if (percentage > 0) {
      return `+${percentage.toFixed(1)}%`;
    } else if (percentage < 0) {
      return `${percentage.toFixed(1)}%`;
    } else {
      return '0%';
    }
  }

  // >>> LES DEUX MÉTHODES SUIVANTES DOIVENT ÊTRE AJOUTÉES ICI <<<

   initProjectionActualChart(): void {
       const chartElement = this.projectionActualChartRef.nativeElement;
       this.projectionActualChartInstance = echarts.init(chartElement);
       this.updateProjectionActualChart();
       window.addEventListener('resize', () => {
           if (this.projectionActualChartInstance) {
               this.projectionActualChartInstance.resize();
           }
       });
   }

   updateProjectionActualChart(): void {
    if (!this.projectionActualChartInstance) {
        return;
    }

    const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        // >>> MODIFIER CETTE SECTION LEGEND <<<
        legend: {
          data: ['Projection', 'Réel'],
          textStyle: { // Ajouter cette propriété pour le style du texte
              color: '#fff' // Définir la couleur du texte en blanc
          }
        },
        // >>> FIN DE LA MODIFICATION <<<
        xAxis: {
          type: 'category',
          data: ['Nouveaux Utilisateurs']
        },
        yAxis: {
          type: 'value',
           axisLabel: {
              formatter: function (value: number) {
                  return Math.round(value);
              }
          },
          minInterval: 1
        },
        series: [
            {
              name: 'Projection',
              type: 'bar',
              data: [this.projectionNewUsers],
              itemStyle: { color: '#ffbb33' },
              label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}'
              }
            },
            {
              name: 'Réel',
              type: 'bar',
              data: [this.actualNewUsers],
              itemStyle: { color: '#28a745' },
              label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}'
              }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
    };

    this.projectionActualChartInstance.setOption(option);
}


}
