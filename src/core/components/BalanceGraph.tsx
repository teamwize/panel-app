import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type BalanceGraphProps = {
    title: "Vacation" | "Sick leave" | "Paid time off";
    used: number;
    quantity: number;
    color: string;
}

export default function BalanceGraph({title, used, quantity, color}: BalanceGraphProps) {
    const data: ChartData<'doughnut'> = {
        labels: ['Used', 'Remaining'],
        datasets: [{
            label: "Balance",
            data: [used, quantity - used], // Corrected the data to show used vs remaining
            backgroundColor: [color, "#64748b"],
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
            <p style={{color: color}}>{title}</p>
            <p>{used} / {quantity}</p>
        </div>
    );
}