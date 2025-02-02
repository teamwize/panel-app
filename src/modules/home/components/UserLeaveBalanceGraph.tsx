import {ArcElement, Chart as ChartJS, ChartData, ChartOptions, Legend, Tooltip} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type BalanceGraphProps = {
    title: string;
    used: number;
    quantity: number;
}

export default function UserLeaveBalanceGraph({title, used, quantity}: BalanceGraphProps) {
    const data: ChartData<'doughnut'> = {
        labels: ['Used', 'Remaining'],
        datasets: [{
            data: [used, quantity - used],
            backgroundColor: ["#86efac", '#93c5fd'],
            borderWidth: 2,
            borderRadius: 4,
        }]
    }

    const options: ChartOptions<'doughnut'> = {
        cutout: "60%",
        plugins: {
            legend: {
                display: false
            }
        }
    }

    return (
        <div className="balance-graph">
            <Doughnut data={data} options={options}></Doughnut>
            <p>{title}: {used} / {quantity}</p>
        </div>
    );
}