import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import automatique de Chart.js pour React

const TemperatureChart = () => {
  const [chartData, setChartData] = useState(null);
  const [length, setLength] = useState(3); // État pour le nombre de mois à afficher

  // Fonction pour récupérer les mois les plus chauds et les plus froids
  const fetchTemperatureData = async () => {
    try {
      // Requête pour les mois les plus chauds
      const hotResponse = await fetch("http://localhost:8080/sparqlv2/querySortedBy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "descend",
          lenght: length, // Utilisation de l'état `length`
          attribute: "Temperature",
        }),
      });

      const hotData = await hotResponse.json();

      // Requête pour les mois les plus froids
      const coldResponse = await fetch("http://localhost:8080/sparqlv2/querySortedBy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ascend",
          lenght: length, // Utilisation de l'état `length`
          attribute: "Temperature",
        }),
      });

      const coldData = await coldResponse.json();

      // Fonction pour convertir le mois "YYYY-MM" en nom complet du mois en français
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
      ];

      // Conversion des données Kelvin -> Celsius pour les mois chauds
      const processedHotData = hotData.results.bindings.map((item, index) => ({
        label: monthNames[parseInt(item.month.value.substring(5, 7), 10) - 1], // Extraire le mois et le convertir en nom
        value: (parseFloat(item.average.value) - 273.15).toFixed(2), // Conversion en °C
        color: `rgba(255, ${120 + index * 40}, ${34 + index * 20}, 0.8)`, // Couleurs chaudes dynamiques
      }));

      // Conversion des données Kelvin -> Celsius pour les mois froids
      const processedColdData = coldData.results.bindings.map((item, index) => ({
        label: monthNames[parseInt(item.month.value.substring(5, 7), 10) - 1], // Extraire le mois et le convertir en nom
        value: (parseFloat(item.average.value) - 273.15).toFixed(2), // Conversion en °C
        color: `rgba(${33 + index * 30}, ${150 + index * 20}, 243, 0.8)`, // Couleurs froides dynamiques
      }));

      // Combinaison des données chaudes et froides
      const combinedData = [...processedHotData, ...processedColdData];

      // Mise à jour de l'état avec les données formatées
      setChartData({
        labels: combinedData.map((item) => `${item.label} (${item.value}°C)`),
        datasets: [
          {
            data: combinedData.map((item) => item.value),
            backgroundColor: combinedData.map((item) => item.color),
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  // Appel des données à l'initialisation et lors de la modification de `length`
  useEffect(() => {
    fetchTemperatureData();
  }, [length]); // Ajout de `length` comme dépendance

  return (
    <div style={{ width: "500px", margin: "0 auto", textAlign: "center" }}>
      <label>
       TOP :
        <input
          type="number"
          min="1"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))} // Met à jour l'état `length`
          style={{ marginLeft: "10px", padding: "5px", width: "60px" }}
        />
      </label>

      {chartData ? (
        <Pie data={chartData} />
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
};

export default TemperatureChart;
