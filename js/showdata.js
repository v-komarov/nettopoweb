// Сервис получения топологии
var url_topo = "http://10.6.1.138:8080/?ip=";

// Сервис получения инфорамции по занятым портам (ЗКЛ) коммутатора доступа
var url_ports = "http://10.6.0.22:8000/equipment/devices/apidata/?action=get_zkllist&ipaddress=";



// Основа картинки

var w = 960, h = 500;
var labelDistance = 0;
var vis = d3.select("picture").append("svg:svg").attr("width", w).attr("height", h);

var nodes = [];
var labelAnchors = [];
var labelAnchorLinks = [];
var links = [];









d3.select("button#getdata").on("click", function() {

    var ip = d3.select("input#ip").property("value");

    // Получение данных топологии
    d3.json(url_topo+ip).then(function(data) {
    //d3.json("data.json").then(function(data) {
        console.log(data);

        // Формирование узлов
        var n = data["data"]["nodes"];
        for(var i = 0; i < n.length; i++) {
    			var node = {
    				label : n[i]["id"]
    			};
    			nodes.push(node);
    			labelAnchors.push({
    				node : node
    			});

        };


        // Формирование связей
        var e = data["data"]["links"];
        for(var i = 0; i < e.length; i++) {
			links.push({
				source : e[i]["source"],
				target : e[i]["target"],
				weight : 1,
                comment : e[i]["comment"]
			});
			labelAnchorLinks.push({
				source : i * 2,
				target : i * 2 + 1,
				weight : 1
			});
		};

        console.log(links);

    });

    //d3.layout.force();
    var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).linkDistance(50).charge(-3000).linkStrength(function(x) {
    				return x.weight * 10
    			});

    force.start();



    d3.json(url_ports+ip).then(function(data) {
        console.log(data);
    });



})
