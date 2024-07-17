import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

type BalanceGraphProps = {
  title: "Vacation" | "Sick leave" | "Paid time off";
  dayOffTypeUsed: number;
  dayOffTypeQuantity: number;
  dayOffTypeColor: string;
}

ChartJS.register(ArcElement, Tooltip, Legend)

export default function BalanceGraph({ title, dayOffTypeUsed, dayOffTypeQuantity, dayOffTypeColor }: BalanceGraphProps) {
  const data: ChartData<'doughnut'> = {
    datasets: [{
      label: "quantity",
      data: [dayOffTypeUsed, dayOffTypeQuantity - dayOffTypeUsed], // Corrected the data to show used vs remaining
      backgroundColor: [dayOffTypeColor, "#c7d2fe"],
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
      <p className='mt-2 text-sm md:text-base' style={{ color: dayOffTypeColor }}>{title}</p>
      <p className='text-sm md:text-base'>{dayOffTypeUsed} / {dayOffTypeQuantity}</p>
    </div>
  );
}