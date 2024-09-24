import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'

type BalanceGraphProps = {
    title: "Vacation" | "Sick leave" | "Paid time off";
    dayOffUsed: number;
    dayOffQuantity: number;
    dayOffColor: string;
}

ChartJS.register(ArcElement, Tooltip, Legend)

export default function BalanceGraph({title, dayOffUsed, dayOffQuantity, dayOffColor}: BalanceGraphProps) {
    const data: ChartData<'doughnut'> = {
        datasets: [{
            label: "quantity",
            data: [dayOffUsed, dayOffQuantity - dayOffUsed], // Corrected the data to show used vs remaining
            backgroundColor: [dayOffColor, "#64748b"],
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
            <p style={{color: dayOffColor}}>{title}</p>
            <p>{dayOffUsed} / {dayOffQuantity}</p>
        </div>
    );
}