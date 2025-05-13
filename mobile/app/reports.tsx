import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, Platform, Linking, Share, ToastAndroid, Dimensions } from 'react-native';
import Card from '@/components/ui/Card';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { ChartBar as FileBarChart, Download, RotateCcw, Calendar, ArrowLeft, ArrowRight, TrendingUp, Users, DollarSign, Boxes, Check, Share2, X, Mail, Printer, Save, Filter, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Define interfaces for report data
interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }>;
  legend?: string[];
}

interface ReportType {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface TimeFilter {
  id: string;
  title: string;
  days: number;
}

export default function ReportsScreen() {
  const [selectedReportType, setSelectedReportType] = useState('1');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [chartWidth, setChartWidth] = useState(350);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // Define report types
  const reportTypes: ReportType[] = [
    { id: '1', title: 'Sales Report', icon: TrendingUp },
    { id: '2', title: 'Inventory', icon: Boxes },
    { id: '3', title: 'Financial', icon: DollarSign },
    { id: '4', title: 'Customer', icon: Users },
  ];

  // Define time filters
  const timeFilters: TimeFilter[] = [
    { id: 'day', title: 'Day', days: 1 },
    { id: 'week', title: 'Week', days: 7 },
    { id: 'month', title: 'Month', days: 30 },
    { id: 'year', title: 'Year', days: 365 },
  ];
  
  // Mock data for different report types and time periods
  const [salesData, setSalesData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => Colors.light.gradientStart,
        strokeWidth: 2,
      },
    ],
    legend: ['Sales'],
  });
  
  const [inventoryData, setInventoryData] = useState<ChartData>({
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
    datasets: [
      {
        data: [25, 40, 15, 35, 20],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
      },
    ],
  });
  
  const [financialData, setFinancialData] = useState<ChartData>({
    labels: ['Revenue', 'Expenses', 'Profit'],
    datasets: [
      {
        data: [65000, 40000, 25000],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      },
    ],
  });

  const [customerData, setCustomerData] = useState<ChartData>({
    labels: ['New', 'Returning', 'Referred'],
    datasets: [
      {
        data: [35, 55, 10],
        color: (opacity = 1) => Colors.light.gradientStart,
      },
    ],
  });
  
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => Colors.light.gradientStart,
    labelColor: () => '#6B7280',
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.light.gradientEnd,
    },
  };
  
  const barChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => Colors.light.gradientStart,
  };

  const pieChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => Colors.light.gradientStart,
  };
  
  // Load data based on selected time period
  useEffect(() => {
    loadReportData();
  }, [selectedTimeFilter, selectedReportType]);
  
  const loadReportData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update data based on time filter and report type
    if (selectedReportType === '1') { // Sales Report
      switch (selectedTimeFilter) {
        case 'day':
          setSalesData({
            labels: ['9am', '11am', '1pm', '3pm', '5pm', '7pm'],
            datasets: [{ 
              data: [12, 18, 30, 25, 40, 15],
              color: () => Colors.light.gradientStart,
              strokeWidth: 2,
            }],
            legend: ['Today\'s Sales'],
          });
          break;
        case 'week':
          setSalesData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ 
              data: [25, 35, 30, 40, 45, 55, 20],
              color: () => Colors.light.gradientStart,
              strokeWidth: 2,
            }],
            legend: ['Weekly Sales'],
          });
          break;
        case 'month':
          setSalesData({
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{ 
              data: [120, 145, 168, 180],
              color: () => Colors.light.gradientStart,
              strokeWidth: 2,
            }],
            legend: ['Monthly Sales'],
          });
          break;
        case 'year':
          setSalesData({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ 
              data: [200, 240, 280, 260, 300, 320, 340, 300, 280, 360, 380, 400],
              color: () => Colors.light.gradientStart,
              strokeWidth: 2,
            }],
            legend: ['Yearly Sales'],
          });
          break;
      }
    } else if (selectedReportType === '2') { // Inventory
      switch (selectedTimeFilter) {
        case 'day':
          setInventoryData({
            labels: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired', 'Reserved'],
            datasets: [{ data: [50, 8, 2, 5, 10] }],
          });
          break;
        case 'week':
          setInventoryData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: [120, 115, 100, 90, 85, 80, 75] }],
          });
          break;
        case 'month':
          setInventoryData({
            labels: ['Cat A', 'Cat B', 'Cat C', 'Cat D', 'Cat E'],
            datasets: [{ data: [25, 40, 15, 35, 20] }],
          });
          break;
        case 'year':
          setInventoryData({
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{ data: [200, 250, 300, 280] }],
          });
          break;
      }
    } else if (selectedReportType === '3') { // Financial
      switch (selectedTimeFilter) {
        case 'day':
          setFinancialData({
            labels: ['Morning', 'Afternoon', 'Evening'],
            datasets: [{ data: [2500, 4200, 1800] }],
          });
          break;
        case 'week':
          setFinancialData({
            labels: ['Revenue', 'Expenses', 'Profit'],
            datasets: [{ data: [12000, 8000, 4000] }],
          });
          break;
        case 'month':
          setFinancialData({
            labels: ['Revenue', 'Expenses', 'Profit'],
            datasets: [{ data: [65000, 40000, 25000] }],
          });
          break;
        case 'year':
          setFinancialData({
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{ data: [75000, 90000, 82000, 95000] }],
          });
          break;
      }
    } else if (selectedReportType === '4') { // Customer
      switch (selectedTimeFilter) {
        case 'day':
          setCustomerData({
            labels: ['Morning', 'Afternoon', 'Evening'],
            datasets: [{ data: [12, 25, 18] }],
          });
          break;
        case 'week':
          setCustomerData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: [15, 20, 18, 25, 30, 35, 12] }],
          });
          break;
        case 'month':
          setCustomerData({
            labels: ['New', 'Returning', 'Referred'],
            datasets: [{ data: [35, 55, 10] }],
          });
          break;
        case 'year':
          setCustomerData({
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{ data: [120, 150, 180, 200] }],
          });
          break;
      }
    }
    
    setIsLoading(false);
  };

  // Handle refresh button
  const handleRefresh = () => {
    loadReportData();
    Alert.alert('Refreshed', 'Report data has been refreshed');
  };

  // Handle date selection
  const handleDateSelect = () => {
    setShowCalendar(true);
  };

  // Handle date change
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowCalendar(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    
    // Update time filter based on selected date
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - currentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      setSelectedTimeFilter('day');
    } else if (diffDays <= 7) {
      setSelectedTimeFilter('week');
    } else if (diffDays <= 30) {
      setSelectedTimeFilter('month');
    } else {
      setSelectedTimeFilter('year');
    }
    
    Alert.alert(
      'Date Selected', 
      `Selected date: ${currentDate.toDateString()}`,
      [
        {
          text: 'View Report',
          onPress: () => loadReportData()
        }
      ]
    );
  };

  // Handle download report
  const handleDownload = () => {
    setShowExportOptions(true);
  };

  // Generate HTML content for the PDF with charts
  const generateHTMLContent = () => {
    const reportTitle = getReportTitle();
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const timePeriod = getTimePeriodText();
    const summary = getReportSummary();
    
    // Convert data to table HTML
    const salesTableRows = salesData.labels.map((label, index) => 
      `<tr><td>${label}</td><td>${salesData.datasets[0].data[index]}</td></tr>`
    ).join('');
    
    const inventoryTableRows = inventoryData.labels.map((label, index) => 
      `<tr><td>${label}</td><td>${inventoryData.datasets[0].data[index]}</td></tr>`
    ).join('');
    
    const financialTableRows = financialData.labels.map((label, index) => 
      `<tr><td>${label}</td><td>${financialData.datasets[0].data[index]}</td></tr>`
    ).join('');
    
    const customerTableRows = customerData.labels.map((label, index) => 
      `<tr><td>${label}</td><td>${customerData.datasets[0].data[index]}</td></tr>`
    ).join('');
    
    // Create chart data HTML
    const generateChartData = (data: ChartData, type: string) => {
      const labels = JSON.stringify(data.labels);
      const values = JSON.stringify(data.datasets[0].data);
      return { labels, values };
    };
    
    const salesChartData = generateChartData(salesData, 'line');
    const inventoryChartData = generateChartData(inventoryData, 'bar');
    const financialChartData = generateChartData(financialData, 'pie');
    const customerChartData = generateChartData(customerData, 'bar');
    
    // Create the HTML for the PDF with charts
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${reportTitle} - ${timePeriod}</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          :root {
            --primary-color: ${Colors.light.gradientStart};
            --secondary-color: ${Colors.light.gradientEnd};
            --text-primary: #1F2937;
            --text-secondary: #6B7280;
            --bg-light: #f8f9fa;
            --border-color: #E5E7EB;
          }
          
          body {
            font-family: 'Poppins', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: var(--text-primary);
            background-color: #F9FAFB;
          }
          
          .container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            padding: 24px 0;
            background-color: white;
            border-radius: 12px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .logo {
            font-size: 24px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 8px;
          }
          
          h1 {
            color: var(--text-primary);
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          
          .subheader {
            color: var(--text-secondary);
            margin: 10px 0 0 0;
            font-size: 16px;
            font-weight: 400;
          }
          
          .section {
            margin-bottom: 24px;
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          h2 {
            color: var(--text-primary);
            font-size: 20px;
            font-weight: 600;
            margin-top: 0;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .chart-container {
            position: relative;
            height: 250px;
            margin: 20px 0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 14px;
          }
          
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
          }
          
          th {
            background-color: var(--bg-light);
            font-weight: 500;
            color: var(--text-secondary);
          }
          
          tr:hover {
            background-color: var(--bg-light);
          }
          
          .summary-box {
            background-color: rgba(16, 185, 129, 0.1);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid var(--primary-color);
          }
          
          .summary-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--primary-color);
            font-size: 16px;
          }
          
          .summary-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .metrics {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-top: 20px;
          }
          
          .metric-card {
            flex: 1;
            min-width: 150px;
            background-color: var(--bg-light);
            padding: 16px;
            border-radius: 8px;
          }
          
          .metric-title {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 8px;
          }
          
          .metric-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">BusinessPro</div>
            <h1>${reportTitle}</h1>
            <p class="subheader">Period: ${timePeriod} • Generated: ${date.toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <div class="summary-box">
              <div class="summary-title">Summary</div>
              <div class="summary-value">${summary}</div>
            </div>
            
            <div class="metrics">
              <div class="metric-card">
                <div class="metric-title">Sales</div>
                <div class="metric-value">$24,500</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">Inventory</div>
                <div class="metric-value">1,245</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">Customers</div>
                <div class="metric-value">842</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Sales Data</h2>
            
            <div class="chart-container">
              <canvas id="salesChart"></canvas>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${salesTableRows}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Inventory Data</h2>
            
            <div class="chart-container">
              <canvas id="inventoryChart"></canvas>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${inventoryTableRows}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Financial Data</h2>
            
            <div class="chart-container">
              <canvas id="financialChart"></canvas>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${financialTableRows}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Customer Data</h2>
            
            <div class="chart-container">
              <canvas id="customerChart"></canvas>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                ${customerTableRows}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            ${reportTitle} • ${timePeriod} • Page 1 of 1
          </div>
        </div>
        
        <script>
          // Initialize charts
          window.onload = function() {
            // Line chart for sales
            const salesCtx = document.getElementById('salesChart').getContext('2d');
            new Chart(salesCtx, {
              type: 'line',
              data: {
                labels: ${salesChartData.labels},
                datasets: [{
                  label: 'Sales',
                  data: ${salesChartData.values},
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  borderColor: 'rgba(16, 185, 129, 1)',
                  borderWidth: 2,
                  tension: 0.4,
                  pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
            
            // Bar chart for inventory
            const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
            new Chart(inventoryCtx, {
              type: 'bar',
              data: {
                labels: ${inventoryChartData.labels},
                datasets: [{
                  label: 'Inventory',
                  data: ${inventoryChartData.values},
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
            
            // Pie chart for financial data
            const financialCtx = document.getElementById('financialChart').getContext('2d');
            new Chart(financialCtx, {
              type: 'pie',
              data: {
                labels: ${financialChartData.labels},
                datasets: [{
                  data: ${financialChartData.values},
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(59, 130, 246, 0.7)'
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(59, 130, 246, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }
            });
            
            // Bar chart for customer data
            const customerCtx = document.getElementById('customerChart').getContext('2d');
            new Chart(customerCtx, {
              type: 'bar',
              data: {
                labels: ${customerChartData.labels},
                datasets: [{
                  label: 'Customers',
                  data: ${customerChartData.values},
                  backgroundColor: 'rgba(245, 158, 11, 0.6)',
                  borderColor: 'rgba(245, 158, 11, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          };
        </script>
      </body>
    </html>
    `;
  };

  // Generate CSV content
  const generateCSVContent = (): string => {
    const reportTitle = getReportTitle();
    const date = new Date();
    const timePeriod = getTimePeriodText();
    
    let csvContent = `"${reportTitle} - ${timePeriod}"\n\n`;
    csvContent += `"Sales Data"\n"Period","Value"\n`;
    
    salesData.labels.forEach((label, index) => {
      csvContent += `"${label}","${salesData.datasets[0].data[index]}"\n`;
    });
    
    csvContent += `\n"Inventory Data"\n"Category","Value"\n`;
    inventoryData.labels.forEach((label, index) => {
      csvContent += `"${label}","${inventoryData.datasets[0].data[index]}"\n`;
    });
    
    csvContent += `\n"Financial Data"\n"Category","Value"\n`;
    financialData.labels.forEach((label, index) => {
      csvContent += `"${label}","${financialData.datasets[0].data[index]}"\n`;
    });
    
    csvContent += `\n"Customer Data"\n"Category","Value"\n`;
    customerData.labels.forEach((label, index) => {
      csvContent += `"${label}","${customerData.datasets[0].data[index]}"\n`;
    });
    
    return csvContent;
  };

  // Handle export options
  const handleExport = async (format: string) => {
    setShowExportOptions(false);
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Set up progress simulation
      let progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 0.9) {
            clearInterval(progressInterval);
            return 0.9;
          }
          return prev + 0.1;
        });
      }, 150);
      
      const reportTitle = getReportTitle();
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (format === 'pdf') {
        // Generate HTML content for PDF
        const htmlContent = generateHTMLContent();
        
        // Create PDF file
        const { uri } = await Print.printToFileAsync({ 
          html: htmlContent,
          base64: false
        });
        
        // Complete the progress
        clearInterval(progressInterval);
        setDownloadProgress(1);
        
        // Small delay to show 100% completion
        setTimeout(async () => {
          setIsDownloading(false);
          
          if (Platform.OS === 'ios') {
            // For iOS, show instructions before sharing
            Alert.alert(
              'Save PDF',
              'To save the PDF to your Files app, please tap "Share" in the next screen, then select "Save to Files".',
              [
                {
                  text: 'Continue',
                  onPress: () => {
                    // Using setTimeout to ensure the alert is dismissed before share sheet appears
                    setTimeout(() => {
                      Sharing.shareAsync(uri, {
                        UTI: 'com.adobe.pdf',
                        mimeType: 'application/pdf',
                      }).then(() => {
                        // Show success message after share sheet is dismissed
                        setTimeout(() => {
                          Alert.alert(
                            'PDF Generated',
                            'Your PDF has been generated. If you chose "Save to Files", you can find it in your Files app.'
                          );
                        }, 1000);
                      });
                    }, 500);
                  }
                }
              ]
            );
          } else {
            // Android handling
            Sharing.shareAsync(uri, {
              mimeType: 'application/pdf',
              dialogTitle: `${reportTitle} Report`
            });
            
            ToastAndroid.show('PDF saved successfully', ToastAndroid.SHORT);
          }
        }, 500);
        
      } else if (format === 'csv') {
        // Generate CSV content
        const csvContent = generateCSVContent();
        
        // Use a better filename with timestamp to avoid conflicts
        const timestamp = new Date().getTime();
        const fileName = `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${formattedDate}_${timestamp}.csv`;
        
        // Create CSV file
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
        
        // Complete the progress
        clearInterval(progressInterval);
        setDownloadProgress(1);
        
        // Small delay to show 100% completion
        setTimeout(async () => {
          setIsDownloading(false);
          
          if (Platform.OS === 'ios') {
            // For iOS, show instructions before sharing
            Alert.alert(
              'Save CSV',
              'To save the CSV file to your Files app, please tap "Share" in the next screen, then select "Save to Files".',
              [
                {
                  text: 'Continue',
                  onPress: () => {
                    // Using setTimeout to ensure the alert is dismissed before share sheet appears
                    setTimeout(() => {
                      Sharing.shareAsync(fileUri, {
                        UTI: 'public.comma-separated-values-text',
                        mimeType: 'text/csv',
                      }).then(() => {
                        // Show success message after share sheet is dismissed
                        setTimeout(() => {
                          Alert.alert(
                            'CSV Generated',
                            'Your CSV file has been generated. If you chose "Save to Files", you can find it in your Files app.'
                          );
                        }, 1000);
                      });
                    }, 500);
                  }
                }
              ]
            );
          } else {
            // Android handling
            Sharing.shareAsync(fileUri, {
              mimeType: 'text/csv',
              dialogTitle: `${reportTitle} Report`
            });
            
            ToastAndroid.show('CSV saved successfully', ToastAndroid.SHORT);
          }
        }, 500);
      }
      
    } catch (error) {
      console.error('Export error:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    }
  };

  // Handle share options
  const handleShare = (option: string) => {
    setShowShareOptions(false);
    
    const reportTitle = getReportTitle();
    const filename = getReportFilename();
    
    switch(option) {
      case 'email':
        // Open email client with pre-filled subject and body
        const subject = `${reportTitle} - ${getTimePeriodText()}`;
        const body = `Please find attached the ${reportTitle} for ${getTimePeriodText()}.\n\nReport Summary:\n• Total: ${getReportSummary()}\n• Generated on: ${new Date().toLocaleDateString()}`;
        
        const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        Linking.canOpenURL(mailUrl)
          .then(supported => {
            if (supported) {
              return Linking.openURL(mailUrl);
            } else {
              Alert.alert('Email Error', 'No email client found on this device.');
            }
          })
          .catch(error => {
            Alert.alert('Error', 'Could not open email client.');
          });
        break;
        
      case 'print':
        // Show printing dialog with animation
        setIsPrinting(true);
        
        // Simulate print process
        setTimeout(() => {
          setIsPrinting(false);
          if (Platform.OS === 'android') {
            ToastAndroid.show('Report sent to printer', ToastAndroid.SHORT);
          } else {
            Alert.alert('Print Successful', 'Report sent to printer');
          }
        }, 2000);
        break;
        
      case 'save':
        // Use native Share API with iOS-specific handling
        if (Platform.OS === 'ios') {
          // On iOS, we need to handle the saving process differently
          const shareContent = {
            title: reportTitle,
            message: `${reportTitle} - ${getTimePeriodText()}`,
            // iOS handles URLs differently, provide a more accurate message
            url: 'shareddocuments://' // iOS system path hint (doesn't actually create a file)
          };
          
          // Show iOS-specific saving message
          Alert.alert(
            'Saving Report',
            'When the share sheet appears, select "Save to Files" to save the PDF to your device.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Short delay to show the alert before opening share sheet
                  setTimeout(() => {
                    Share.share(shareContent)
                      .then(result => {
                        if (result.action === Share.sharedAction) {
                          // Show success message after sharing
                          setTimeout(() => {
                            Alert.alert(
                              'Report Ready',
                              `Your report "${getReportFilename()}" is ready to view in your Files app.`
                            );
                          }, 1000);
                        }
                      })
                      .catch(() => {
                        Alert.alert('Error', 'Could not save the report. Please try again.');
                      });
                  }, 1500);
                }
              },
              {
                text: 'Cancel',
                style: 'cancel'
              }
            ]
          );
        } else {
          // Android implementation remains the same
          const shareContent = {
            title: reportTitle,
            message: `${reportTitle} - ${getTimePeriodText()}`,
            url: `file://${filename}` // This is a dummy URL for Android
          };
          
          Share.share(shareContent)
            .then(result => {
              if (result.action === Share.sharedAction) {
                ToastAndroid.show('Report saved successfully', ToastAndroid.SHORT);
              }
            })
            .catch(() => {
              Alert.alert('Error', 'Could not save the report');
            });
        }
        break;
    }
  };

  // Get report filename
  const getReportFilename = () => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return `${getReportTitle().replace(/\s+/g, '_').toLowerCase()}_${formattedDate}.pdf`;
  };

  // Handle next period
  const handleNextPeriod = () => {
    Alert.alert('Next Period', 'Navigate to next time period');
  };

  // Handle previous period
  const handlePrevPeriod = () => {
    Alert.alert('Previous Period', 'Navigate to previous time period');
  };

  // Get report title based on selected type
  const getReportTitle = () => {
    const report = reportTypes.find(r => r.id === selectedReportType);
    return report ? report.title : 'Report';
  };

  // Get time period display text
  const getTimePeriodText = () => {
    const currentDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    switch (selectedTimeFilter) {
      case 'day':
        return `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'week':
        return `Week of ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
      case 'month':
        return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'year':
        return `${currentDate.getFullYear()}`;
      default:
        return '';
    }
  };
  
  // Get report summary based on type
  const getReportSummary = () => {
    switch(selectedReportType) {
      case '1': // Sales
        return '$24,500';
      case '2': // Inventory
        return '1,245 items';
      case '3': // Financial
        const revenue = financialData.datasets[0].data[0];
        return `$${revenue.toLocaleString()}`;
      case '4': // Customer
        return '842 customers';
      default:
        return '';
    }
  };
  
  // Add new filter categories
  const filterCategories = [
    { id: 'all', label: 'All Categories' },
    { id: 'sales', label: 'Sales' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'financial', label: 'Financial' },
    { id: 'customers', label: 'Customers' },
  ];

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => 
        prev.includes(categoryId) 
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId]
      );
    }
  };
  
  const renderReportContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.gradientStart} />
          <Text style={styles.loadingText}>Loading report data...</Text>
        </View>
      );
    }
    
    switch (selectedReportType) {
      case '1': // Sales Report
        return (
          <View>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{getReportTitle()}</Text>
              <Text style={styles.periodText}>{getTimePeriodText()}</Text>
            </View>
            
            <Card>
              <LineChart
                data={salesData}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card>
            
            <View style={styles.reportSummary}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Total Sales</Text>
                <Text style={styles.summaryValue}>$24,500</Text>
                <Text style={styles.summaryChange}>+15% vs last {selectedTimeFilter}</Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Transactions</Text>
                <Text style={styles.summaryValue}>367</Text>
                <Text style={styles.summaryChange}>+8% vs last {selectedTimeFilter}</Text>
              </Card>
            </View>
          </View>
        );
      case '2': // Inventory Report
        return (
          <View>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{getReportTitle()}</Text>
              <Text style={styles.periodText}>{getTimePeriodText()}</Text>
            </View>
            
            <Card>
              <BarChart
                data={inventoryData}
                width={chartWidth}
                height={220}
                chartConfig={barChartConfig}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
              />
            </Card>
            
            <View style={styles.reportSummary}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Total Items</Text>
                <Text style={styles.summaryValue}>1,245</Text>
                <Text style={styles.summaryChange}>+3% vs last {selectedTimeFilter}</Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Low Stock</Text>
                <Text style={styles.summaryValue}>23</Text>
                <Text style={[styles.summaryChange, styles.negativeChange]}>+5% vs last {selectedTimeFilter}</Text>
              </Card>
            </View>
          </View>
        );
      case '3': // Financial Report
        return (
          <View>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{getReportTitle()}</Text>
              <Text style={styles.periodText}>{getTimePeriodText()}</Text>
            </View>
            
            <Card>
              <PieChart
                data={[
                  {
                    name: 'Revenue',
                    value: financialData.datasets[0].data[0],
                    color: '#10B981',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                  },
                  {
                    name: 'Expenses',
                    value: financialData.datasets[0].data[1],
                    color: '#F59E0B',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                  },
                  {
                    name: 'Profit',
                    value: financialData.datasets[0].data[2],
                    color: '#3B82F6',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                  },
                ]}
                width={chartWidth}
                height={220}
                chartConfig={pieChartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card>
            
            <View style={styles.reportSummary}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Revenue</Text>
                <Text style={styles.summaryValue}>${financialData.datasets[0].data[0].toLocaleString()}</Text>
                <Text style={styles.summaryChange}>+12% vs last {selectedTimeFilter}</Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Expenses</Text>
                <Text style={styles.summaryValue}>${financialData.datasets[0].data[1].toLocaleString()}</Text>
                <Text style={[styles.summaryChange, styles.negativeChange]}>+5% vs last {selectedTimeFilter}</Text>
              </Card>
            </View>
          </View>
        );
      case '4': // Customer Report
        return (
          <View>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{getReportTitle()}</Text>
              <Text style={styles.periodText}>{getTimePeriodText()}</Text>
            </View>
            
            <Card>
              <BarChart
                data={customerData}
                width={chartWidth}
                height={220}
                chartConfig={barChartConfig}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
              />
            </Card>
            
            <View style={styles.reportSummary}>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Total Customers</Text>
                <Text style={styles.summaryValue}>842</Text>
                <Text style={styles.summaryChange}>+15% vs last {selectedTimeFilter}</Text>
              </Card>
              <Card style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Retention Rate</Text>
                <Text style={styles.summaryValue}>87%</Text>
                <Text style={styles.summaryChange}>+2% vs last {selectedTimeFilter}</Text>
              </Card>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.emptyReport}>
            <Text style={styles.emptyReportText}>Select a report type to view</Text>
          </View>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Reports</Text>
        <AnimatedLogo size={32} color={Colors.light.tint} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryButtonsContainer}
          >
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.categoryButton,
                  selectedReportType === type.id && styles.selectedCategoryButton
                ]}
                onPress={() => {
                  setSelectedReportType(type.id);
                  loadReportData();
                }}
              >
                <type.icon 
                  size={18} 
                  color={selectedReportType === type.id ? '#FFFFFF' : Colors.light.gradientStart} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  selectedReportType === type.id && styles.selectedCategoryButtonText
                ]}>
                  {type.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.periodNavigation}>
            <TouchableOpacity style={styles.navButton} onPress={handlePrevPeriod}>
              <ArrowLeft size={18} color={Colors.light.gradientStart} />
            </TouchableOpacity>
            <View style={styles.timeFilterContainer}>
              {timeFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.timeFilterButton,
                    selectedTimeFilter === filter.id && styles.selectedTimeFilterButton,
                  ]}
                  onPress={() => {
                    setSelectedTimeFilter(filter.id);
                    loadReportData();
                  }}
                >
                  <Text
                    style={[
                      styles.timeFilterText,
                      selectedTimeFilter === filter.id && styles.selectedTimeFilterText,
                    ]}
                  >
                    {filter.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.navButton} onPress={handleNextPeriod}>
              <ArrowRight size={18} color={Colors.light.gradientStart} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDateSelect}>
              <Calendar size={18} color={Colors.light.gradientStart} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
              <RotateCcw size={18} color={Colors.light.gradientStart} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
              <Download size={18} color={Colors.light.gradientStart} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reportContent} onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setChartWidth(width - 32);
        }}>
          {renderReportContent()}
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showCalendar && (
        <Modal
          transparent={true}
          visible={showCalendar}
          animationType="slide"
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                style={styles.datePicker}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => {
                    setShowCalendar(false);
                    handleDateChange({ type: 'set' } as DateTimePickerEvent, selectedDate);
                  }}
                >
                  <Text style={styles.datePickerButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Download Progress Modal */}
      <Modal
        transparent={true}
        visible={isDownloading}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.downloadModal}>
            <Text style={styles.downloadTitle}>Generating Report</Text>
            <Text style={styles.downloadFilename}>{getReportFilename()}</Text>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
            </View>
            
            <Text style={styles.progressText}>{Math.round(downloadProgress * 100)}%</Text>
          </View>
        </View>
      </Modal>

      {/* Share Options Modal */}
      <Modal
        transparent={true}
        visible={showShareOptions}
        animationType="slide"
        onRequestClose={() => setShowShareOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.shareModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.downloadCompleteTitle}>Download Complete</Text>
              <TouchableOpacity onPress={() => setShowShareOptions(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.downloadFilename}>{getReportFilename()}</Text>
            
            <View style={styles.downloadSuccessIcon}>
              <Check size={32} color="#10B981" />
            </View>
            
            <Text style={styles.shareTitle}>Share Report</Text>
            
            <View style={styles.shareOptions}>
              <TouchableOpacity 
                style={styles.shareOption} 
                onPress={() => handleShare('email')}
              >
                <Mail size={20} color={Colors.light.gradientStart} style={styles.shareOptionIcon} />
                <Text style={styles.shareOptionText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareOption}
                onPress={() => handleShare('print')}
              >
                <Printer size={20} color={Colors.light.gradientStart} style={styles.shareOptionIcon} />
                <Text style={styles.shareOptionText}>Print</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.shareOption}
                onPress={() => handleShare('save')}
              >
                <Save size={20} color={Colors.light.gradientStart} style={styles.shareOptionIcon} />
                <Text style={styles.shareOptionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Print Progress Modal */}
      <Modal
        transparent={true}
        visible={isPrinting}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.downloadModal}>
            <Text style={styles.downloadTitle}>Printing Report</Text>
            <Text style={styles.downloadFilename}>{getReportFilename()}</Text>
            
            <View style={styles.printerAnimation}>
              <Printer size={32} color={Colors.light.gradientStart} />
              <View style={styles.printerDots}>
                <View style={[styles.printerDot, styles.dot1]} />
                <View style={[styles.printerDot, styles.dot2]} />
                <View style={[styles.printerDot, styles.dot3]} />
              </View>
            </View>
            
            <Text style={styles.progressText}>Sending to printer...</Text>
          </View>
        </View>
      </Modal>

      {/* Export Options Modal */}
      <Modal
        transparent={true}
        visible={showExportOptions}
        animationType="slide"
        onRequestClose={() => setShowExportOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.exportModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Export Report</Text>
              <TouchableOpacity onPress={() => setShowExportOptions(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.exportOptions}>
              <TouchableOpacity 
                style={styles.exportOption}
                onPress={() => handleExport('pdf')}
              >
                <View style={styles.exportOptionIcon}>
                  <FileBarChart size={24} color={Colors.light.gradientStart} />
                </View>
                <Text style={styles.exportOptionText}>PDF Document</Text>
                <Text style={styles.exportOptionDescription}>High-quality report with tables</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.exportOption}
                onPress={() => handleExport('csv')}
              >
                <View style={styles.exportOptionIcon}>
                  <TrendingUp size={24} color={Colors.light.gradientStart} />
                </View>
                <Text style={styles.exportOptionText}>CSV File</Text>
                <Text style={styles.exportOptionDescription}>Data for spreadsheet analysis</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  periodNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeFilterContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedTimeFilterButton: {
    backgroundColor: Colors.light.gradientStart + '20',
  },
  timeFilterText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  selectedTimeFilterText: {
    color: Colors.light.gradientStart,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportContent: {
    paddingHorizontal: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  emptyReport: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyReportText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  reportSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryCard: {
    width: '48%',
    padding: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryChange: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  negativeChange: {
    color: Colors.light.error,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  datePicker: {
    width: 300,
    height: 200,
  },
  datePickerButton: {
    backgroundColor: Colors.light.gradientStart,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  datePickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  downloadModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  downloadFilename: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.gradientStart,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  shareModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  downloadCompleteTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  downloadSuccessIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  shareTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 16,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareOption: {
    backgroundColor: Colors.light.gradientStart + '10',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 6,
  },
  shareOptionText: {
    color: Colors.light.gradientStart,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginTop: 4,
  },
  shareOptionIcon: {
    marginBottom: 4,
  },
  printerAnimation: {
    marginVertical: 24,
    alignItems: 'center',
  },
  printerDots: {
    flexDirection: 'row',
    marginTop: 12,
  },
  printerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.gradientStart,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.3,
    transform: [{ scale: 0.8 }],
  },
  dot2: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
  dot3: {
    opacity: 1,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gradientStart + '10',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    minWidth: 120,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.light.gradientStart,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  exportModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exportOptions: {
    gap: 12,
  },
  exportOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.gradientStart + '10',
    borderRadius: 8,
  },
  exportOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
    marginBottom: 4,
  },
  exportOptionDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  exportOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.gradientStart + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});