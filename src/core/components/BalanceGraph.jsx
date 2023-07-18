import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

export default function Graph({ balance, total, color }) {
  ChartJS.register(ArcElement, Tooltip, Legend)

  const data = {
    datasets: [{
      label: "quantity",
      data: [balance, total],
      backgroundColor: [color, "#d1d5db"],
      borderWidth: 2,
    }]
  }
  
  const options = {
    cutout: "60%",
    borderRadius: 4,
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return <Doughnut data={data} options={options}></Doughnut>
}