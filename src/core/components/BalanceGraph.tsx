import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

type BalanceGraphProps = {
    title: "Vacation" | "Sick leave" | "Paid time off";
    dayOffTypeUsed: number;
    dayOffTypeQuantity: number;
    dayOffTypeColor: string;
}

ChartJS.register(ArcElement, Tooltip, Legend)

export default function BalanceGraph({title, dayOffTypeUsed, dayOffTypeQuantity, dayOffTypeColor}: BalanceGraphProps) {
    const data: ChartData<'doughnut'> = {
        datasets: [{
            label: "quantity",
            data: [dayOffTypeUsed, dayOffTypeQuantity - dayOffTypeUsed], // Corrected the data to show used vs remaining
            backgroundColor: [dayOffTypeColor, "#64748b"],
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
            <p style={{color: dayOffTypeColor}}>{title}</p>
            <p>{dayOffTypeUsed} / {dayOffTypeQuantity}</p>
        </div>
    );
}