import {Component, OnInit} from '@angular/core';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {CheckoutService} from '../../../service/checkout.service';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    constructor(private checkoutService: CheckoutService) {

    }

    radioModel: string = 'Month';

    // lineChart1
    public lineChart1Data: Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Series A'
        }
    ];
    public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart1Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                }

            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: 40 - 5,
                    max: 84 + 5,
                }
            }],
        },
        elements: {
            line: {
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart1Colours: Array<any> = [
        {
            backgroundColor: getStyle('--primary'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart1Legend = false;
    public lineChart1Type = 'line';

    // lineChart2
    public lineChart2Data: Array<any> = [
        {
            data: [1, 18, 9, 17, 34, 22, 11],
            label: 'Series A'
        }
    ];
    public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart2Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                }

            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: 1 - 5,
                    max: 34 + 5,
                }
            }],
        },
        elements: {
            line: {
                tension: 0.00001,
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart2Colours: Array<any> = [
        { // grey
            backgroundColor: getStyle('--info'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart2Legend = false;
    public lineChart2Type = 'line';


    // lineChart3
    public lineChart3Data: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'Series A'
        }
    ];
    public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart3Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart3Colours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
        }
    ];
    public lineChart3Legend = false;
    public lineChart3Type = 'line';


    // barChart1
    public barChart1Data: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
            label: 'Series A',
            barPercentage: 0.6,
        }
    ];
    public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    public barChart1Options: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        }
    };
    public barChart1Colours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.3)',
            borderWidth: 0
        }
    ];
    public barChart1Legend = false;
    public barChart1Type = 'bar';

    // mainChart

    public mainChartElements = 27;
    public dataNew: Array<number> = [];
    public dataProcessing: Array<number> = [];
    public dataDone: Array<number> = [];
    public dataCancel: Array<number> = [];

    public mainChartData: Array<any> = [
        {
            data: this.dataNew,
            label: 'Đơn mới'
        },
        {
            data: this.dataProcessing,
            label: 'Đang vận chuyển'
        },
        {
            data: this.dataDone,
            label: 'Hoàn thành'
        },
        {
            data: this.dataCancel,
            label: 'Đơn hủy'
        }
    ];
    public mainColors = [
        {
            backgroundColor: '#007bff'
        },
        {
            backgroundColor: '#ffc107'
        },
        {
            backgroundColor: '#28a745'
        },
        {
            backgroundColor: '#dc3545'
        },
    ];
    /* tslint:disable:max-line-length */
    public mainChartLabels: Array<any> = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    /* tslint:enable:max-line-length */
    public mainChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public mainChartLegend = true;
    public mainChartType = 'bar';

    // social box charts

    public brandBoxChartData1: Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Facebook'
        }
    ];
    public brandBoxChartData2: Array<any> = [
        {
            data: [1, 13, 9, 17, 34, 41, 38],
            label: 'Twitter'
        }
    ];
    public brandBoxChartData3: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'LinkedIn'
        }
    ];
    public brandBoxChartData4: Array<any> = [
        {
            data: [35, 23, 56, 22, 97, 23, 64],
            label: 'Google+'
        }
    ];

    public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public brandBoxChartOptions: any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public brandBoxChartColours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.1)',
            borderColor: 'rgba(255,255,255,.55)',
            pointHoverBackgroundColor: '#fff'
        }
    ];
    public brandBoxChartLegend = false;
    public brandBoxChartType = 'line';

    public random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    ngOnInit(): void {
        this.getAllChart('week');
    }

    totalSold = 0;

    getChart(status, type) {
        this.checkoutService.getChart({status, type}).subscribe(res => {
            const data = res.body;
            if (status == 1) {
                this.dataNew.length = 0;
                data.forEach(e => {
                    this.dataNew.push(e.count);
                });
            }

            if (status == 2) {
                this.dataProcessing.length = 0;
                data.forEach(e => {
                    this.dataProcessing.push(e.count);
                });
            }

            if (status == 3) {
                this.dataDone.length = 0;
                this.totalSold = 0;
                data.forEach(e => {
                    this.totalSold += e.value;
                    this.dataDone.push(e.count);
                });
            }

            if (status == 0) {
                this.dataCancel.length = 0;
                data.forEach(e => {
                    this.dataCancel.push(e.count);
                });
            }
        });
    }

    getAllChart(type) {
        for (let i = 0; i < 4; i++) {
            this.getChart(i, type);
        }
    }

    public optionSl = 1;

    changeOption(option: number) {
        this.optionSl = option;
        if (option === 1) {
            this.mainChartLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            this.getAllChart('week');
        }
        if (option === 2) {
            this.mainChartLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
            this.getAllChart('month');
        }
    }
}
