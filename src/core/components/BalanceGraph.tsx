import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

type GraphProps = {
  dayoffTypeUsed: number;
  dayoffTypeQuantity: number;
  dayoffTypecolor: string
}

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Graph({ dayoffTypeUsed, dayoffTypeQuantity, dayoffTypecolor }: GraphProps) {
  const data: ChartData<'doughnut'> = {
    datasets: [{
      label: "quantity",
      data: [dayoffTypeUsed, dayoffTypeQuantity],
      backgroundColor: [dayoffTypecolor, "#c7d2fe"],
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

  return <Doughnut data={data} options={options}></Doughnut>
}