google.charts.load('current', {packages: ['corechart']});
//google.charts.load('current', {'packages':['corechart','bar']});

var options1 = {'title':'Revision number distribution by year and by user type',
		'width':400,
		'height':300};

var options2 = {'title':'Revision number distribution by user type',
		'width':400,
		'height':300};

var options3 = {'title':'Revision distribution by year of user',
		'width':400,
		'height':300};

var overallData
var articles

// show most/least revisions functions
var revNum = 3;
function showMostRevs() {
    var mostRevisions = new Array();
    $.getJSON('/mostRevisions',function(result) {
    	for (i=0;i<revNum;i++){
            mostRevisions.push(result[i]['_id']+", ");
		}
        $('#mostRevs').html(mostRevisions);
    });
}
function showLeastRevs() {
    var leastRevisions = new Array();
    $.getJSON('/leastRevisions',function(result) {
        for (i=0;i<revNum;i++){
            leastRevisions.push(result[i]['_id']+", ");
        }
        $('#leastRevs').html(leastRevisions);
    });
}

// show largest/smallest group functions
var gpNum = 1;
function showLargeGp(){
	var largeGp = new Array();
	$.getJSON('/largestGroup',function(result){
		for (i=0;i<gpNum;i++){
			largeGp.push(result[i]['_id']+", ");
		}
		$('#largeGp').html(largeGp);
	});
}
function showSmallGp(){
    var smallGp = new Array();
    $.getJSON('/smallestGroup',function(result){
        for (i=0;i<gpNum;i++){
            smallGp.push(result[i]['_id']+", ");
        }
        $('#smallGp').html(smallGp);
    });
}

// show longest/shortest history functions
var longNum = 3;
var shortNum =1;
function showLongHis(){
	var longHis = new Array();
	$.getJSON('/longestHistory',function (result) {
		for (i=0;i<longNum;i++){
			longHis.push(result[i]['_id']+", ");
		}
		$('#longHis').html(longHis);
    })
}
function showShortHis(){
    var shortHis = new Array();
    $.getJSON('/shortestHistory',function (result) {
        for (i=0;i<shortNum;i++){
            shortHis.push(result[i]['_id']+", ");
        }
        $('#shortHis').html(shortHis);
    })
}

// draw google charts
function drawColumnChart(title){
    // draw overall column chart
    if (title == null) {
        graphData = new google.visualization.DataTable();
        graphData.addColumn('string', 'Year');
        graphData.addColumn('number', 'Administrator');
        graphData.addColumn('number', 'Anonymous');
        graphData.addColumn('number', 'Bot');
        graphData.addColumn('number', 'Regular user');
        $.each(overallData, function (index, value) {
            graphData.addRow([value['Year'], value['Administrator'], value['Anonymous'], value['Bot'], value['Regular_user']]);
            //console.log([key,val]);
        })
        var chart = new google.visualization.ColumnChart($("#overallChart")[0]);
        chart.draw(graphData, options1);
    }
    //draw individual article chart
    else {
        //console.log('draw individual article');
        var data = google.visualization.arrayToDataTable(barChart_data);
        for (var item in selected_user){
            options3['title'] += selected_user[item]
            options3['title'] += ', '
        }
        options3['title'] += 'for Article '
        options3['title'] += articleTitle
        var chart = new google.charts.Bar($('#IndividualChart')[0]);
        chart.draw(data, google.charts.Bar.convertOptions(options1));
    }
}
function drawPieChart(){
	var adminNum = 0;
	var anonNum = 0;
 	var botNum = 0;
	var userNum = 0;
	graphData = new google.visualization.DataTable();
	graphData.addColumn('string','User Type');
	graphData.addColumn('number','Percentage');
	$.each(overallData,function (index,value) {
		adminNum += value['Administrator'];
		anonNum += value['Anonymous'];
		botNum += value['Bot'];
		userNum += value['Regular_user'];
    })
	//console.log(adminNum,anonNum,botNum,userNum);
    graphData.addRow(['Administrator',adminNum]);
    graphData.addRow(['Anonymous',anonNum]);
    graphData.addRow(['Bot',botNum]);
    graphData.addRow(['Regular user',userNum]);
	var chart = new google.visualization.PieChart($("#overallChart")[0]);
	chart.draw(graphData,options2);
}

function drawBarChart(selected_user,article_name){
	options3['title'] = 'Revision distribution by year of user'
	var data = google.visualization.arrayToDataTable(barChart_data);
	for (var item in selected_user){
		options3['title'] += selected_user[item]
		options3['title'] += ', '
	}
	options3['title'] += 'for Article '
	options3['title'] += articleTitle
	var chart = new google.charts.Bar($('#IndividualChart')[0]);
	chart.draw(data, google.charts.Bar.convertOptions(options3));
}

//************************************************************
//************************************************************
//************************************************************

$(document).ready(function() {
	showMostRevs();
	showLeastRevs();

	showLargeGp();
	showSmallGp();

	showLongHis();
	showShortHis();

    $.getJSON('/overallChartData',function (result) {
        overallData = result;
        //console.log(overallData);
    })
    $('#chartList').bind("change",function(event){
        var obj = $('#chartList');
        chart_name = obj.find("option:selected").text()
        event.preventDefault();
        if(chart_name == 'Select The Chart Type'){
            return
        }
        if (chart_name == 'Piechart'){
        	console.log('drawing pie chart')
            drawPieChart()
        }
        else{
        	console.log('drawing column chart')
            drawColumnChart()
        }
    })

    $.getJSON('/mostRevisions',function(result) {
        articles = result;
        //console.log(articles);
        var artArray = new Array();
		for (i=0;i<articles.length;i++) {
            var option = document.createElement('option');
            //option.innerHTML = articles[i]['_id']+" ("+articles[i]['numOfEdits']+" revisions)";
			option.innerHTML = articles[i]['_id'];
            option.value = i;
            $('#articleList').append(option);
            artArray.push(articles[i]['_id']);
        }
        $("#titleInput").autocomplete({
			source: artArray
		});
    })
   	
   	$('#articleList').bind("change",function(event){
   		$('#chartType option:first').prop("selected","selected")
   		//$('#checkboxArea').html("")
   		//shown = 0
   		var obj = $('#articleList');
   		articleTitle = obj.find("option:selected").text()
   		title = {title:articleTitle}
   		//event.preventDefault();
   		if (articleTitle == 'Select Article'){
   			return
   		}
   		$.getJSON('/revisions',title,function(result){
   		    alert(result['count']+' new revisions of '+title.title+' have been downloaded')
   		})
   		$.getJSON('/articles',title,function(result){
            Title = 'Title: '+ result['Title'];
            RevNum = 'Total number of revisions: '+ result['RevNum'];
   			top5 = result['top5'];
   			top5Text = 'Top 5 users: '+ result['top5'].join(", ")
   			$('#SelectedTitle').text(Title)
   			$('#SelectedRevisions').text(RevNum)
   			$('#SelectedTop5').text(top5Text)
   			article_data1 = result['result']
   		})
		drawColumnChart(articleTitle)
   	})
    $('#titleBtn').click(function(event){
        selectedTitle = $('#titleInput').val();
        req = {title:selectedTitle};
        $.getJSON('/revisions',req,function(result){
            alert(result['count']+' new revisions of '+req.title+' have been downloaded')
        })
    })
   	
   	$('#chartType').bind("change",function(event){
   		var obj = $('#chartType');
   		chart_name = obj.find("option:selected").text()
   		
   		var obj_name = $('#articleList');
   		articleTitle = obj_name.find("option:selected").text()
   		
   		event.preventDefault();
   		
   		if (chart_name == 'Select Chart Type'){
   			return;
   		}
   		
   		
   		if (chart_name =="Bar Chart1"){
   			$('#checkboxArea').html("")
   			shown = 0
   			drawColumnChart(articleTitle)
   		}
   		
   		if (chart_name == "Pie Chart1"){
   			$('#checkboxArea').html("")
   			shown = 0
   			var number_Administrator = 0
   			var number_Anonymous = 0
   			var number_Bot = 0
   			var number_Regular = 0
   			var tmp = new Array()
   			tmp.push(['User type','Number'])
   			for (var year in article_data1){
   				if (year == 0){continue}
   				number_Administrator += article_data1[year][1]
   				number_Anonymous += article_data1[year][2]
   				number_Bot += article_data1[year][3]
   				number_Regular += article_data1[year][4]
   			}
   			tmp.push(['Administrator',number_Administrator])
   			tmp.push(['Anonymous',number_Anonymous])
   			tmp.push(['Bot',number_Bot])
   			tmp.push(['Regular user',number_Regular])
   			article_data2 = tmp
   			drawPieChart(articleTitle)
   		}
   		
   		
   		if (chart_name == "Bar Chart2" && shown == 0){
   			for (var item in top5){
   	   			var checkbox = document.createElement('input');
   	   			checkbox.type = 'checkbox';
   	   			checkbox.name = 'name';
   	   			checkbox.value = item;
   	   			
   	   			var label = document.createElement('label');
//   	   			label.htmlFor = 'CheckBoxTop5';
   	   			label.appendChild(document.createTextNode(top5[item]));
   	   			
   	   			$('#checkboxArea').append(checkbox);
   	   			$('#checkboxArea').append(label);
   	   			$('#checkboxArea').append("<br />");
   			}
   			shown = 1
   		}
   		
   		
   	})
   	
   	$('#submit').click(function(event){
   		var obj = $('#articleList');
   		articleTitle = obj.find("option:selected").text()
   		
   		var id_array = new Array();
   		var selected_user = new Array();
   		
   		
   		$('#checkboxArea :checked').each (function(){
   			id_array.push($(this).val());
   		})
   		if (id_array.length == 0){
   			alert('please select at least one top user')
   		}
   		else{
	   		event.preventDefault();
	   		for (var item in id_array){
	   			user_id = id_array[item]
	   			top5_user_name = top5[user_id]
	   			selected_user.push(top5_user_name)
	   		}
	   		paras = {users:selected_user,title:articleTitle}
	   		
	   		$.ajaxSettings.async = false
	   		$.getJSON('/getDataForTop5',paras,function(data){
	   			barChart_data = data['result']
	   		})
	   		$.ajaxSettings.async = true
	   		
	   		drawBarChart(selected_user,articleTitle)
   		}
   	})
   	
   	$('#navlist').click(function(event){
   		event.preventDefault();
   		
   	})
    $('#revNumBtn').click(function(event){
    	revNum = $('#revNumInput').val();
    	showMostRevs();
		showLeastRevs();
    })
});