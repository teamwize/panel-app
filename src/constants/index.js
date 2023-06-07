export const logo = {
  src: "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600",
  alt: "Work Hive"
}

export const countries = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Canada', code: 'CA' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Egypt', code: 'EG' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Japan', code: 'JP' },
  { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Singapore', code: 'SG' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Yemen', code: 'YE' },
]

import { CalendarIcon, Cog6ToothIcon, ChartPieIcon } from '@heroicons/react/24/outline'

export const navigation = [
  { name: 'Calendar', icon: CalendarIcon, href: '/calendar' },
  { name: 'Balance', icon: ChartPieIcon, href: '/balance' },
  { name: 'Settings', icon: Cog6ToothIcon, href: '/setting' }
]

export const leaveType = [
  { name: "Vacation", value: 'VACATION' },
  { name: "Sick leave", value: "SICK_LEAVE" },
  { name: 'Paid time', value: 'PAID_TIME' }
]

// export const css = `
// .my-selected:not([disabled]) { 
//     font-weight: bold; 
//     border: 2px solid currentColor;
// }
// .my-selected:hover:not([disabled]) { 
//     border-color: #4f46e6;
//     color: #4f46e6;
    
// }
// .my-today { 
//     font-weight: bold;
//     font-size: 110%; 
// }

// @media (min-width: 768px) {
//   .styles {
//     cell {
//       padding: 10px 20px
//     }
//   }
// }
// `

export const leaveTypeJson = {
  "VACATION": "Vacation",
  "SICK_LEAVE": "Sick leave",
  "PAID_TIME": 'Paid time'
}

export const statusJson = {
  "PENDING": "Pending",
  "ACCEPTED": "Accepted",
  "REJECTED": 'Rejected'
}

export const weekDays = [
  {day : "Monday"},
  {day : "Tuesday"},
  {day : "Wednesday"},
  {day : "Thursday"},
  {day : "Friday"},
  {day : "Saturday"},
  {day : "Sunday"}
]