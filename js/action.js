$(document).ready(function() {

    // Сервис получения топологии
    url_topo = "http://10.6.1.138:8080/?ip=";

    // Сервис получения инфорамции по занятым портам (ЗКЛ) коммутатора доступа
    url_ports = "http://10.6.0.22:8000/equipment/devices/apidata/?action=get_zkllist&ipaddress=";

    // Поиск по ip адресу
    $("button#getdata").bind("click", SearchIP);

});





// Наполнение строк сегмента
function SegmentRows(data) {

    // суммарные значения
    var sum_use = 0;
    var sum_reserv = 0;
    var sum_tech = 0;

    $("table#segment tbody").empty();

    if (data["ip"] != data["aggr"]) {


        console.log(data);

        $.each(data["segment"]["nodes"], function( index, value ) {
            var ip = value["id"];

            // Получение данных по коммутаторам
            var jqxhr = $.getJSON(url_ports+ip,
               function(data) {
                   if (data.length != 0) {

                       sum_use += data[0]['port_use'];
                       sum_reserv += data[0]['port_reserv'];
                       sum_tech += data[0]['port_tech'];

                       // Наполнение таблицы данными
                       var t = "<tr>"
                       +"<td>"+data[0]['ip']+"</td>"
                       +"<td>"+data[0]['sysname']+"</td>"
                       +"<td>"+data[0]['address']+"</td>"
                       +"<td>"+data[0]['port_use']+"</td>"
                       +"<td>"+data[0]['port_reserv']+"</td>"
                       +"<td>"+data[0]['port_tech']+"</td>"
                       +"</tr>";

                       $("table#segment tbody").append(t);


                       // Итоговые значение
                       var ts = "<tr id=sum>"
                       +"<td></td>"
                       +"<td></td>"
                       +"<td></td>"
                       +"<td>"+sum_use+"</td>"
                       +"<td>"+sum_reserv+"</td>"
                       +"<td>"+sum_tech+"</td>"
                       +"</tr>";

                       $("table#segment tbody tr#sum").remove();
                       $("table#segment tbody").append(ts);


                   }

               })

        });





    }

}





// Наполнение строк агрегации
function AggRows(data) {

    // Очистка ip агрегатора
    $("ag").text(data["aggr"]);

    // суммарные значения
    var sum_use = 0;
    var sum_reserv = 0;
    var sum_tech = 0;

    $("table#aggr tbody").empty();

    $.each(data["data"]["nodes"], function( index, value ) {
        var ip = value["id"];

        // Получение данных по коммутаторам
        var jqxhr = $.getJSON(url_ports+ip,
           function(data) {
               if (data.length != 0) {

                   sum_use += data[0]['port_use'];
                   sum_reserv += data[0]['port_reserv'];
                   sum_tech += data[0]['port_tech'];

                   // Наполнение таблицы данными
                   var t = "<tr>"
                   +"<td>"+data[0]['ip']+"</td>"
                   +"<td>"+data[0]['sysname']+"</td>"
                   +"<td>"+data[0]['address']+"</td>"
                   +"<td>"+data[0]['port_use']+"</td>"
                   +"<td>"+data[0]['port_reserv']+"</td>"
                   +"<td>"+data[0]['port_tech']+"</td>"
                   +"</tr>";

                   $("table#aggr tbody").append(t);


                   // Итоговые значение
                   var ts = "<tr id=sum>"
                   +"<td></td>"
                   +"<td></td>"
                   +"<td></td>"
                   +"<td>"+sum_use+"</td>"
                   +"<td>"+sum_reserv+"</td>"
                   +"<td>"+sum_tech+"</td>"
                   +"</tr>";

                   $("table#aggr tbody tr#sum").remove();
                   $("table#aggr tbody").append(ts);


               }

           })

    });

}





function GetData(ip) {

    var jqxhr = $.getJSON(url_topo+ip,
       function(data) {
           if (data["result"] == "ok") {

               // Агрегация список устройств
               AggRows(data);
               SegmentRows(data);
           }

       })
}






function SearchIP() {

    var ip = $("input#ip").val().match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/);
    if (ip) { GetData(ip[0]); }
    else { $("input#ip").val(""); }

}
