import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ScrollView, Button, Alert } from 'react-native';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import io from 'socket.io-client';
import moment from 'moment-timezone';


export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('lastHour');
  const [sensorId, setSensorId] = useState('');
  const { token } = route.params;

  // Conexão com o servidor Socket.IO
  useEffect(() => {
    const socket = io('http://localhost:3000', {
      query: { token },
    });

    socket.on('sensorDataUpdate', (newData) => {
      setSensorData((prevData) => {
        const updatedData = [...prevData, newData];
        return filterSensorData(updatedData);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Busca inicial dos dados do sensor
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const filteredData = filterSensorData(data);
        setSensorData(filteredData);
      } catch (error) {
        console.error('Erro ao buscar dados dos sensores:', error);
      }
    };

    fetchSensorData();
  }, [token, timeRange, sensorId]);

  const filterSensorData = (data) => {
    const now = new Date(); // Obtém a data e hora atuais
    
    return data.filter((item) => {
      const itemDate = new Date(item.timestamp); // Converte o timestamp em um objeto Date
  
      // Verifica se a data do item é válida
      if (isNaN(itemDate.getTime())) {
        console.warn(`Data inválida encontrada: ${item.timestamp}`);
        return false; // Ignora dados com timestamp inválido
      }
  
      // Verifica se o item está dentro do intervalo de tempo selecionado
      let isInTimeRange = false;
      switch (timeRange) {
        case 'last15Minutes':
          isInTimeRange = itemDate >= new Date(now.getTime() - 15 * 60 * 1000);
          break;
        case 'last30Minutes':
          isInTimeRange = itemDate >= new Date(now.getTime() - 30 * 60 * 1000);
          break;
        case 'lastHour':
          isInTimeRange = itemDate >= new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case 'last24Hours':
          isInTimeRange = itemDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        default:
          isInTimeRange = true; // Retorna todos os dados se nenhum intervalo estiver selecionado
      }
      // Verifica se o sensor corresponde ao filtro selecionado
      const isSensorMatch = sensorId ? String(item.sensor_id) === String(sensorId) : true;
  
      return isInTimeRange && isSensorMatch;
    });
  };

  useEffect(() => {
    const filteredData = filterSensorData(sensorData);
    setSensorData(filteredData);
  }, [timeRange, sensorId]);

  const dataTemperatura = {
    labels: sensorData.map((item) =>
      moment.tz(item.timestamp, "America/Sao_Paulo").format('HH:mm:ss')
    ),
    datasets: [
      {
        label: 'Temperatura',
        data: sensorData.map((item) => item.temperatura),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const dataUmidade = {
    labels: sensorData.map((item) =>
      moment.tz(item.timestamp, "America/Sao_Paulo").format('HH:mm:ss')
    ),
    datasets: [
      {
        label: 'Umidade',
        data: sensorData.map((item) => item.umidade),
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const optionsTemperatura = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
        },
        time: {
          unit: 'hour', // Unidade de tempo
          tooltipFormat: 'll HH:mm', // Formato do tooltip
          displayFormats: {
              hour: 'HH:mm' // Formato de exibição
          },
          // Aqui é onde você define o fuso horário
          parser: (value) => moment(value).tz('America/Sao_Paulo').toDate() // Converte as datas para o fuso horário
      }
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
        beginAtZero: true,
      },
    },
  };

  const optionsUmidade = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
        },
        time: {
          unit: 'hour', // Unidade de tempo
          tooltipFormat: 'll HH:mm', // Formato do tooltip
          displayFormats: {
              hour: 'HH:mm' // Formato de exibição
          },
          // Aqui é onde você define o fuso horário
          parser: (value) => moment(value).tz('America/Sao_Paulo').toDate() // Converte as datas para o fuso horário
      }
      },
      y: {
        title: {
          display: true,
          text: 'Umidade Relativa (%)',
        },
        beginAtZero: true,
      },
    },
  };

  const renderChart = (type, data, options) => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Clima dos estados brasileiros</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Sensor</Text>
          <Picker
            selectedValue={sensorId}
            style={styles.picker}
            onValueChange={(itemValue) => setSensorId(itemValue)}
          >
            <Picker.Item label="Todos os estados" value="" />
            <Picker.Item label="São Paulo" value="1" />
            <Picker.Item label="Rio de Janeiro" value="2" />
            <Picker.Item label="Minas Gerais" value="3" />
            <Picker.Item label="Santa Catarina" value="4" />
            <Picker.Item label="Bahia" value="5" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Intervalo de Tempo</Text>
          <Picker
            selectedValue={timeRange}
            style={styles.picker}
            onValueChange={(itemValue) => setTimeRange(itemValue)}
          >
            <Picker.Item label="Últimos 15 minutos" value="last15Minutes" />
            <Picker.Item label="Últimos 30 minutos" value="last30Minutes" />
            <Picker.Item label="Última hora" value="lastHour" />
            <Picker.Item label="Últimas 24 horas" value="last24Hours" />
          </Picker>
        </View>

        <View style={styles.chartWrapper}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Temperatura</Text>
            {renderChart(chartType, dataTemperatura, optionsTemperatura)}
          </View>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Umidade</Text>
            {renderChart(chartType, dataUmidade, optionsUmidade)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chartWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  chartContainer: {
    width: '48%',
  },
  chartTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    alignItems: 'center',
    height: 50,
  },
});
