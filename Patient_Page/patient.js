console.log("patient.js terload");
let isUserNameSet = false;
let historyChart;

function updateUserName(newName) {
    const userNameElem = document.getElementById('user-name');
    if (!userNameElem) return;
    if (!isUserNameSet) {
        userNameElem.style.transition = "opacity 0.4s ease";
        userNameElem.style.opacity = 0;
        setTimeout(() => {
            userNameElem.textContent = newName;
            userNameElem.style.opacity = 1;
            isUserNameSet = true;
        }, 400);
    } else {
        userNameElem.textContent = newName;
    }
}

function updateSensorData() {
    console.log("updateSensorData dipanggil");
    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");
    if (!room) {
        console.error("Room belum dipilih.");
        const waktuElem = document.querySelector('.waktu-value');
        const spo2Elem = document.querySelector('.spo2-value');
        if (waktuElem) waktuElem.textContent = "";
        if (spo2Elem) spo2Elem.innerHTML = "";
        return;
    }
    fetch('get_data.php?room=' + encodeURIComponent(room))
        .then(response => response.json())
        .then(data => {
            console.log("Data sensor dari server:", data);
            const waktuElem = document.querySelector('.waktu-value');
            const spo2Elem = document.querySelector('.spo2-value');
            if (waktuElem && spo2Elem) {
                waktuElem.textContent = data.waktu;
                spo2Elem.innerHTML = data.spo2_value + '<sub class="percent">%</sub>';
            } else {
                console.error("Elemen .waktu-value atau .spo2-value tidak ditemukan!");
            }
        })
        .catch(error => {
            console.error('Error mengambil data sensor:', error);
        });
}

function fetchPatientData(room) {
    fetch('get_patient_data.php?room=' + encodeURIComponent(room))
    .then(response => response.json())
    .then(data => {
        console.log("Data pasien dari server:", data);
        document.getElementById('patient-name').textContent = data.name || "-";
        document.getElementById('birth-place').textContent = data.birth_place || "-";
        document.getElementById('birth-date').textContent = data.birth_date || "-";
        document.getElementById('blood-type').textContent = data.blood_type || "-";
        document.getElementById('gender').textContent = data.gender || "-";
        document.getElementById('age').textContent = data.age || "-";
        document.getElementById('phone').textContent = data.phone || "-";
        document.getElementById('address').textContent = data.address || "-";
    })
    .catch(error => {
        console.error('Error mengambil data pasien:', error);
    });

}

function updateHistoryChart(room) {
    fetch('get_history.php?room=' + encodeURIComponent(room))
        .then(response => response.json())
        .then(data => {
            console.log("History data:", data);

            const labels = data.map(dp => dp.waktu);
            const spo2Values = data.map(dp => dp.spo2_value);

            if (historyChart) {
                historyChart.data.labels = labels;
                historyChart.data.datasets[0].data = spo2Values;
                historyChart.update();
            } else {
                const ctx = document.getElementById('historyChart').getContext('2d');
                historyChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'SpO₂',
                            data: spo2Values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Waktu'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Nilai SpO₂'
                                },
                                suggestedMin: 90,
                                suggestedMax: 100
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
        })
        .catch(error => {
            console.error("Error fetching history data:", error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    let selectedRoom = params.get("room");

    if (selectedRoom) {
        fetchPatientData(selectedRoom);
        updateSensorData();
        setInterval(updateSensorData, 5000);

        updateHistoryChart(selectedRoom);
        setInterval(() => {
            updateHistoryChart(selectedRoom);
        }, 5000);
    } else {
        console.warn("Parameter room tidak ditemukan di URL.");
        const waktuElem = document.querySelector('.waktu-value');
        const spo2Elem = document.querySelector('.spo2-value');
        if (waktuElem) waktuElem.textContent = "";
        if (spo2Elem) spo2Elem.innerHTML = "";
    }

    if (selectedRoom) {
        dropdowns.forEach(dropdown => {
            const selected = dropdown.querySelector('.selected');
            selected.innerText = selectedRoom;
            const options = dropdown.querySelectorAll('.menu li');
            options.forEach(opt => {
                if (opt.innerText.trim() === selectedRoom.trim()) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        });

        const dataHistoryLink = document.querySelector('.btn');
        if (dataHistoryLink) {
            dataHistoryLink.href = `data_history.html?room=${selectedRoom}`;
        }
    }
});

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            options.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');

            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            window.location.href = `patient.html?room=${option.innerText.trim()}`;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    let selectedRoom = params.get("room");
    if (selectedRoom) {
        dropdowns.forEach(dropdown => {
            const selected = dropdown.querySelector('.selected');
            selected.innerText = selectedRoom;
            const options = dropdown.querySelectorAll('.menu li');
            options.forEach(opt => {
                if (opt.innerText.trim() === selectedRoom.trim()) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        });
        const dataHistoryLink = document.querySelector('.btn');
        if (dataHistoryLink) {
            dataHistoryLink.href = `data_history.html?room=${selectedRoom}`;
        }
    }
});

function loadFullHistory(room) {
    fetch('get_full_history.php?room=' + encodeURIComponent(room))
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#historyTable tbody');

            if (data.error) {
                tbody.innerHTML = `<tr><td colspan="5">${data.error}</td></tr>`;
                return;
            }
            if (data.message) {
                tbody.innerHTML = `<tr><td colspan="5">${data.message}</td></tr>`;
                return;
            }

            tbody.innerHTML = "";

            data.forEach((item, index) => {
                const tr = document.createElement('tr');

                const tdNo = document.createElement('td');
                tdNo.textContent = index + 1;
                tr.appendChild(tdNo);

                const tdRoom = document.createElement('td');
                tdRoom.textContent = item.room;
                tr.appendChild(tdRoom);

                const tdSpo2 = document.createElement('td');
                tdSpo2.textContent = item.spo2_value;
                tr.appendChild(tdSpo2);

                const tdWaktu = document.createElement('td');
                tdWaktu.textContent = item.waktu;
                tr.appendChild(tdWaktu);

                const tdRecorded = document.createElement('td');
                tdRecorded.textContent = item.recorded_at;
                tr.appendChild(tdRecorded);

                tbody.appendChild(tr);
            });

            console.log("Jumlah baris dalam tabel history:", document.querySelectorAll("#historyTable tbody tr").length);
        })
        .catch(error => {
            console.error('Error fetching full history:', error);
            const tbody = document.querySelector('#historyTable tbody');
            tbody.innerHTML = `<tr><td colspan="5">Error fetching data</td></tr>`;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room) {
        loadFullHistory(room);
    } else {
        console.warn("Parameter room tidak ditemukan di URL.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    let selectedRoom = params.get("room");

    if (!selectedRoom) {
        updateUserName("Please Choose Room");
        return;
    }

    fetch("get_patient_data.php?room=" + encodeURIComponent(selectedRoom))
        .then(response => response.json())
        .then(data => {
            console.log("Data pasien saat load:", data);

            if (data.name) {
                updateUserName(data.name);
            } else {
                updateUserName("No Patient Found");
            }
        })
        .catch(error => {
            console.error("Error fetching patient data:", error);
            updateUserName("Error Loading Data");
        });
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Loaded, mulai mengambil data...");

    fetchOxygenLevel();
    setInterval(fetchOxygenLevel, 5000);
});

function fetchOxygenLevel() {
    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");
    if (!room) {
        console.warn("Parameter room tidak ditemukan di URL.");
        return;
    }
    fetch('get_data.php?room=' + encodeURIComponent(room))
        .then(response => response.json())
        .then(data => {
            console.log("📥 Data dari Server:", data);

            let spo2Value = parseInt(data.spo2_value);
            if (!isNaN(spo2Value) && spo2Value > 0) {
                console.log("✅ SPO2 Value Parsed:", spo2Value);
                updateOxygenStatus(spo2Value);
            } else {
                console.error("⚠️ Data SPO2 tidak valid:", data.spo2_value);
            }
        })
        .catch(error => console.error("❌ Error Fetching Data:", error));
}

function updateOxygenStatus(spo2Value) {
    let statusBox = document.getElementById("statusBox");
    let statusText = document.getElementById("statusText");
    let statusIndicator = document.getElementById("statusIndicator");

    if (!statusBox || !statusText || !statusIndicator) {
        console.error("❌ Elemen '#statusBox', '#statusText', atau '#statusIndicator' tidak ditemukan!");
        return;
    }

    statusBox.classList.remove("safe", "warning", "danger");

    if (spo2Value === "N/A") {
        statusText.innerHTML = "❓ NO DATA";
        statusBox.classList.add("warning");
        statusIndicator.style.backgroundColor = "gray"; 
    } else {
        let spo2 = parseInt(spo2Value);

        if (spo2 >= 95 && spo2 <= 100) {
            statusText.innerHTML = "SAFE";
            statusBox.classList.add("safe");
            statusIndicator.style.backgroundColor = "green"; 
        } else if (spo2 >= 90 && spo2 < 95) {
            statusText.innerHTML = "WARNING";
            statusBox.classList.add("warning");
            statusIndicator.style.backgroundColor = "yellow"; 
        } else if (spo2 < 90) {
            statusText.innerHTML = "LOW OXYGEN";
            statusBox.classList.add("danger");
            statusIndicator.style.backgroundColor = "red"; 
        }
    }
}

console.log(document.querySelectorAll("#historyTable tbody tr").length);
