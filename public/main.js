//google.charts.load('current', {packages: ['corechart']});
google.charts.load('current', {'packages':['corechart','bar']});

//var options = {'title':"Composition of Earth's atmosphere  ",
//        'width':400,
//        'height':300};

var options1 = {'title':'Revision distribution by year and by user type',
		'width':400,
		'height':300};

var options2 = {'title':'Revision proportion by user type',
		'width':400,
		'height':300};

var options3 = {'title':'Revision distribution by year of user',
		'width':400,
		'height':300};


//var data 
//var testdata
var shown = 0
var top5

var article_data1
var article_data2
var overall_data1
var overall_data2

var barChart_data

//function drawPie(){
//   	graphData = new google.visualization.DataTable();
//	graphData.addColumn('string', 'Element');
//	graphData.addColumn('number', 'Percentage');
//	var test = {'Nitrogen': 0.78, 'Oxygen': 0.21, 'Other': 0.01}
//	$.each(test, function(key, val) {
//		graphData.addRow([key, val]);
//	})
//	var chart = new google.visualization.PieChart($("#columnchart1")[0]);
//	chart.draw(graphData, options);
//}

function drawBarChart(selected_user,article_name){
	options3['title'] = 'Revision distribution by year of user'
	var data = google.visualization.arrayToDataTable(barChart_data);
	for (var item in selected_user){
		options3['title'] += selected_user[item]
		options3['title'] += ', '
	}
	options3['title'] += 'for Article '
	options3['title'] += article_name
	var chart = new google.charts.Bar($('#IndividualChart')[0]);
	chart.draw(data, google.charts.Bar.convertOptions(options3));
}



function drawPieChart(name){
	options2['title'] = 'Revision proportion by user type';
	if (name != null){
		options2['title'] += ' for article ';
		options2['title'] += name;
		var data = google.visualization.arrayToDataTable(article_data2)
		var chart = new google.visualization.PieChart($('#IndividualChart')[0]);		
	}
	else{
		var data = google.visualization.arrayToDataTable(overall_data2);
		var chart = new google.visualization.PieChart($('#OverallChart')[0]);
	}
	
    chart.draw(data, options2);
}

function drawColumnChart(name){
	options1['title'] = 'Revision distribution by year and by user type';
	
	if (name != null){
		options1['title'] += ' for article ';
		options1['title'] += name;
		var data = google.visualization.arrayToDataTable(article_data1)
		var chart =  new google.charts.Bar($('#IndividualChart')[0])
	}
	else{
		var data = google.visualization.arrayToDataTable(overall_data1)
		var chart =  new google.charts.Bar($('#OverallChart')[0])
	}
	chart.draw(data,google.charts.Bar.convertOptions(options1))
}


$(document).ready(function() {	
	var selected_article = $('#articleList').val();
	$('selectedTitle').val($('#articleList').val());
   	
   	$('#articleList').bind("change",function(event){
   		$('#chartType option:first').prop("selected","selected")
   		$('#checkboxArea').html("")
   		shown = 0
   		
   		var obj = $('#articleList');
   		article_name = obj.find("option:selected").text()
   		title = {title:article_name}
   		event.preventDefault();
   		
   		if (article_name == 'Select Article'){
   			return
   		}
   		
   		$.ajaxSettings.async = false
   		$.getJSON('/update',title,function(data){
   		    alert("Updated "+data['count']+' new revisions')
   		})
   		
   		
   		$.getJSON('/getDataForArticle',title,function(data){
   			top5 = data['top5']
   			top5String = 'Top 5 users: '+ data['top5'].join(", ")
   			Title = 'Title: '+ data['Title']
   			TotalNumber = 'Total number of revisions: '+ data['TotalNumber']
   			
   			$('#SelectedTitle').text(Title)
   			$('#SelectedRevisions').text(TotalNumber)
   			$('#SelectedTop5').text(top5String)
   			
   			article_data1 = data['result']
   		})
   		$.ajaxSettings.async = true	
		drawColumnChart(article_name)  		
   	})
   	
   	
   	$('#chartList').bind("change",function(event){
   		var obj = $('#chartList');
   		chart_name = obj.find("option:selected").text()
   		event.preventDefault();
   		
   		if(chart_name == 'Select The Chart Type'){
   			return
   		}
   		
   		$.ajaxSettings.async = false
   		$.getJSON('/getChartData',null,function(rdata){
   			overall_data1 = rdata['result']    
   		})
   		if (chart_name == 'Piechart'){
   			var number_Administrator = 0
   			var number_Anonymous = 0
   			var number_Bot = 0
   			var number_Regular = 0
   			var tmp = new Array()
   			tmp.push(['User type','Number'])
   			for (var year in overall_data1){
   				if (year == 0){continue}
   				number_Administrator += overall_data1[year][1]
   				number_Anonymous += overall_data1[year][2]
   				number_Bot += overall_data1[year][3]
   				number_Regular += overall_data1[year][4]
   			}
   			tmp.push(['Administrator',number_Administrator])
   			tmp.push(['Anonymous',number_Anonymous])
   			tmp.push(['Bot',number_Bot])
   			tmp.push(['Regular user',number_Regular])
   			overall_data2 = tmp
   			drawPieChart()
   		}
   		else{
   			drawColumnChart()
   		}
   		$.ajaxSettings.async = true
   	})
   	
   	$('#chartType').bind("change",function(event){
   		var obj = $('#chartType');
   		chart_name = obj.find("option:selected").text()
   		
   		var obj_name = $('#articleList');
   		article_name = obj_name.find("option:selected").text()
   		
   		event.preventDefault();
   		
   		if (chart_name == 'Select Chart Type'){
   			return;
   		}
   		
   		
   		if (chart_name =="Bar Chart1"){
   			$('#checkboxArea').html("")
   			shown = 0
   			drawColumnChart(article_name)
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
   			drawPieChart(article_name)
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
   		article_name = obj.find("option:selected").text()
   		
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
	   		paras = {users:selected_user,title:article_name}
	   		
	   		$.ajaxSettings.async = false
	   		$.getJSON('/getDataForTop5',paras,function(data){
	   			barChart_data = data['result']
	   		})
	   		$.ajaxSettings.async = true
	   		
	   		drawBarChart(selected_user,article_name)
   		}
   	})
   	
   	$('#navlist').click(function(event){
   		event.preventDefault();
   		
   	})
   	
   	
});