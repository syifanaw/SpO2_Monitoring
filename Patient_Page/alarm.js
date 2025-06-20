const alarmList = document.querySelector(".semuabox");
const donut = document.querySelector(".donut");

let lastSpO2 = null;
let alarms = Array(7).fill({ type: "none", message: "No Recent Alarms" }); 

async function fetchRealtimeSpO2() {
    console.log("updateSensorData dipanggil");

    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");

    if (!room) {
        console.error("Room belum dipilih.");
        return; 
    }

    fetch('get_data.php?room=' + encodeURIComponent(room))
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error fetching SpO2 data:", data.error);
                return;
            }

            console.log("Data SpO2:", data);

            let newSpO2 = parseInt(data.spo2_value); 

            if (!isNaN(newSpO2)) {
                checkAlarm(newSpO2);
                lastSpO2 = newSpO2; 
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

function checkAlarm(newSpO2) {
    if (lastSpO2 !== null) {
        let drop = lastSpO2 - newSpO2;

        if (newSpO2 < 90) {
            addAlarm("danger", "SpO2 Under 90%");
        } else if (drop >= 2 && drop <= 5) {
            addAlarm("warning", `SpO2 Drop by ${drop}%`);
        } else if (drop > 5) {
            addAlarm("danger", `SpO2 Drop by ${drop}%`);
        } else if (newSpO2 >= 90 && newSpO2 <= 95) {
            addAlarm("warning", "SpO2 Between 90-95%");
        }
    }
}

function addAlarm(type, message) {
    if (alarms[0].message === message) return; 

    alarms.pop(); 
    alarms.unshift({ type, message }); 
    updateAlarms();
    updateDonutChart(); 
}

function updateAlarms() {
    alarmList.innerHTML = "";

    alarms.forEach(alarm => {
        let box = document.createElement("div");
        box.className = "box";

        let indikator = document.createElement("div");
        indikator.className = "indikator";
        indikator.style.backgroundColor =
            alarm.type === "danger" ? "red" :
                alarm.type === "warning" ? "#fc921f" :
                    "gray"; 

        let text = document.createElement("p");
        text.innerHTML = `<span>${alarm.type !== "none" ? alarm.type.toUpperCase() + ": " : ""}</span>${alarm.message}`;

        box.appendChild(indikator);
        box.appendChild(text);
        alarmList.appendChild(box);
    });
}

function updateDonutChart() {
    let dangerCount = alarms.filter(a => a.type === "danger").length;
    let warningCount = alarms.filter(a => a.type === "warning").length;
    let totalAlarms = dangerCount + warningCount;

    let dangerPercentage = totalAlarms > 0 ? (dangerCount / totalAlarms) * 100 : 0;
    let warningPercentage = totalAlarms > 0 ? (warningCount / totalAlarms) * 100 : 0;

    donut.style.backgroundImage = `conic-gradient(
        #e74f4f 0% ${dangerPercentage}%, 
        #fc921f ${dangerPercentage}% ${dangerPercentage + warningPercentage}%, 
        #ddd ${dangerPercentage + warningPercentage}% 100%
    )`;
}

setInterval(fetchRealtimeSpO2, 5000);
fetchRealtimeSpO2(); // Jalankan pertama kali agar langsung update

// 🔄 Jalankan pertama kali untuk menampilkan 6 alarm default dan donut awal
updateAlarms();
updateDonutChart();
