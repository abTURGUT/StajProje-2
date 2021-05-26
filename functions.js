var chart1 = document.getElementById('chart1').getContext('2d');
var chart2 = document.getElementById('chart2').getContext('2d');
var chart3 = document.getElementById('chart3').getContext('2d');

var genderCountLabel = [];
var genderLabel = [];
var genderDict = [];

var ageCountLabel = [];
var ageLabel = [];
var ageDict = [];

var schoolCountLabel = [];
var schoolLabel = [];
var schoolDict = [];



const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tiles = L.tileLayer(tileUrl,{attribution});

var mymap = L.map('map').setView([0,0], 11);
tiles.addTo(mymap);


var dataUrl = 'https://us-central1-outsmartooh-demo.cloudfunctions.net/data';

fetch(dataUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {


        ////////////////////////////////////////////////////////////////////////////////////////////
                                    /* KOORDİNATLARI HARİTALAMA */
        ////////////////////////////////////////////////////////////////////////////////////////////

        var meanLatitude = 0;
        var meanLongitude = 0;

        for (var i = 0; i < data.data.length; i++) {

            var latitude = data.data[i].geo[0];
            var longitude = data.data[i].geo[1];
            
            meanLatitude += latitude;
            meanLongitude += longitude;

            L.marker([latitude,longitude]).addTo(mymap); //koordinatı haritada işaretler
        }

        meanLatitude /= data.data.length;
        meanLongitude /= data.data.length;

        mymap.panTo([meanLatitude,meanLongitude]);  //konumların ortalamalarını kullanarak harita bakışını işaretlenen yerlere ortalamaya çalıştım


        ////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////



        ////////////////////////////////////////////////////////////////////////////////////////////
                             /* CİNSİYETLERİ PASTA GRAFİĞİNDE GÖSTERME */
        ////////////////////////////////////////////////////////////////////////////////////////////


        //gelen cinsiyet bilgileri sözlüğe atılır, işlenir ve chart üzerinde görselleştirilir
    
        var genderFlag = false;
        
        for (var i = 0; i < data.data.length; i++) { 
            genderFlag = false;

            for (var j = 0; j < i; j++) {
                if(genderLabel[j] == data.data[i].gender) {genderCountLabel[j] += 1; genderFlag = true; break; }  //bu cinsiyet daha önce diziye eklendiyse sadece sayısı arttırılır
            }

            if(!genderFlag) {genderLabel[i] = data.data[i].gender; genderCountLabel[i] = 1;} //bu cinsiyet daha önce diziye eklenmediyse oluşturulur ve sayısı 1' ayarlanır
        }

        for (var i = 0; i < genderLabel.length; i++) {
            genderDict[genderLabel[i]] = genderCountLabel[i]; //dizilerdeki bilgiler ile sözlük oluşturulur
        }

        genderDict = Object.keys(genderDict).sort().reduce((r, k) => (r[k] = genderDict[k], r), {});  //sıralama işlemi burda yapılır

        //oluşturduğumuz sözlük ile pasta grafiği elde edilir
        new Chart(chart1, {
            type: 'pie',
            data: {
                datasets: [{
                data: Object.values(genderDict),
                backgroundColor: ['#2957C1', '#E75480']
                }],
                labels: Object.keys(genderDict)
            },
            options: {
                responsive: true,
                legend: {
                position: 'bottom'
                },
                plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'start',
                    offset: -10,
                    borderWidth: 2,
                    borderColor: '#fff',
                    borderRadius: 25,
                    backgroundColor: (context) => {
                    return context.dataset.backgroundColor;
                    },
                    font: {
                    weight: 'bold',
                    size: '10'
                    },
                    formatter: (value) => {
                    return value + ' %';
                    }
                }
                }
            }
            });

        ////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////



        ////////////////////////////////////////////////////////////////////////////////////////////
                             /* YAŞLARI SÜTUN GRAFİĞİNDE GÖSTERME */
        ////////////////////////////////////////////////////////////////////////////////////////////

        //gelen yaş bilgileri sözlüğe atılır, işlenir ve chart üzerinde görselleştirilir

        var ageFlag = false;

        for (var i = 0; i < data.data.length; i++) {
            ageFlag = false;

            for (var j = 0; j < i; j++) {
                if(ageLabel[j] == data.data[i].age) {ageCountLabel[j] += 1; ageFlag = true; break; } //bu yaş daha önce diziye eklendiyse sadece sayısı arttırılır
            }

            if(!ageFlag) {ageLabel[i] = data.data[i].age; ageCountLabel[i] = 1;} //bu yaş daha önce diziye eklenmediyse oluşturulur ve sayısı 1' ayarlanır
        }

        for (var i = 0; i < ageLabel.length; i++) {
            ageDict[ageLabel[i]] = ageCountLabel[i]; //dizilerdeki bilgiler ile sözlük oluşturulur
        }

        ageDict = Object.keys(ageDict).sort().reduce((r, k) => (r[k] = ageDict[k], r), {}); //sıralama işlemi burda yapılır

        //oluşturduğumuz sözlük ile pasta grafiği elde edilir
        new Chart(chart2, {
            type: 'bar',
            data: {
                datasets: [{
                data: Object.values(ageDict),
                backgroundColor:[ "red","blue","yellow","green","purple","yellow","black","cyan"],
                }],
                labels: Object.keys(ageDict)
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {beginAtZero:true}
                    }]
                },
            }
            });


        ////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////////////////////////////////////
                            /* EĞİTİM BİLGİLERİNİ SÜTUN GRAFİĞİNDE GÖSTERME */
        ////////////////////////////////////////////////////////////////////////////////////////////

        //gelen eğitim bilgileri sözlüğe atılır, işlenir ve chart üzerinde görselleştirilir

        var schoolFlag = false;

        for (var i = 0; i < data.data.length; i++) {

            schoolFlag = false;

            for (var j = 0; j < i; j++) {
                if(schoolLabel[j] == data.data[i].edu) {schoolCountLabel[j] += 1; schoolFlag = true; break; } //bu eğitim bilgisi daha önce diziye eklendiyse sadece sayısı arttırılır
            }

            if(!schoolFlag) {schoolLabel[i] = data.data[i].edu; schoolCountLabel[i] = 1;} //bu eğitim bilgisi daha önce diziye eklenmediyse oluşturulur ve sayısı 1' ayarlanır
        }

        for (var i = 0; i < schoolLabel.length; i++) {

            if(schoolLabel[i] != undefined){
                schoolDict[schoolLabel[i]] = schoolCountLabel[i]; //dizilerdeki bilgiler ile sözlük oluşturulur
            }
            
        }

        schoolDict = Object.keys(schoolDict).sort().reduce((r, k) => (r[k] = schoolDict[k], r), {}); //sıralama işlemi burda yapılır
        
        //oluşturduğumuz sözlük ile pasta grafiği elde edilir
        new Chart(chart3, {
            type: 'bar',
            data: {
                datasets: [{
                data: Object.values(schoolDict),
                backgroundColor:[ "red","blue"],
                }],
                labels: Object.keys(schoolDict)
            },
            
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [{
                        ticks: {beginAtZero:true}
                    }]
                },

            }
            });

    })
    .catch(function (err) {
        console.log('error: ' + err);
    });







